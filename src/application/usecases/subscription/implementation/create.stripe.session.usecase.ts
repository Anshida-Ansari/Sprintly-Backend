import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { inject, injectable } from "inversify";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import Stripe from "stripe";
import type { ICreateStripeSessionUseCase } from "../interface/create.stripe.session.interface";

@injectable()
export class CreateStripeSessionUseCase implements ICreateStripeSessionUseCase {
	private _stripe: any;

	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {
		const secretKey = process.env.STRIPE_SECRET_KEY;
		if (!secretKey) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		this._stripe = new Stripe(secretKey, { 
			apiVersion: "2026-03-25.dahlia" as any,
			typescript: true 
		});
	}

	async execute(
		companyId: string,
		priceId: string,
		successUrl?: string,
		cancelUrl?: string,
	): Promise<{ sessionId: string; url: string | null }> {
		// Ensure companyId is a plain string (not a MongoDB ObjectId buffer)
		const companyIdStr = companyId?.toString();
		const company = await this._companyRepository.findByCompanyId(companyIdStr);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		let stripeCustomerId = company.stripeCustomerId;

		if (!stripeCustomerId) {
			// Create Stripe customer using company name (no email lookup needed)
			const customer = await this._stripe.customers.create({
				name: company.companyName,
				metadata: {
					companyId: companyIdStr,
				},
			});
			stripeCustomerId = customer.id;

			// Save the stripe customer ID
			await this._companyRepository.updatePlan(
				companyIdStr,
				company.currentPlan,
				company.projectLimit,
				stripeCustomerId,
			);
		}

		const frontendUrl = process.env.FRONTENT_URL || "http://localhost:5173";
		const finalSuccessUrl = successUrl || `${frontendUrl}/admin/projects?upgraded=true`;
		const finalCancelUrl = cancelUrl || `${frontendUrl}/admin/projects`;

		const session = await this._stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			payment_method_types: ["card"],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: finalSuccessUrl,
			cancel_url: finalCancelUrl,
			metadata: {
				companyId: companyIdStr,
			},
		});

		return {
			sessionId: session.id,
			url: session.url,
		};
	}
}
