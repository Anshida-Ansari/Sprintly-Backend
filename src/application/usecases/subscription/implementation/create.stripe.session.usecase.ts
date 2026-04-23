import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import Stripe from "stripe";
import type { ICreateStripeSessionUseCase } from "../interface/create.stripe.session.interface";

@injectable()
export class CreateStripeSessionUseCase implements ICreateStripeSessionUseCase {
	private _stripe: Stripe;

	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {
		const secretKey = process.env.STRIPE_SECRET_KEY;
		if (!secretKey) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		this._stripe = new Stripe(secretKey, {
			// biome-ignore lint/suspicious/noExplicitAny: Stripe version mismatch in SDK types
			apiVersion: "2024-06-20" as any, // Using a stable version if the specific one is unknown to current SDK types
			typescript: true,
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

		// Validate that the priceId exists in our dynamic plans
		const plan =
			await this._subscriptionPlanRepository.findByStripePriceId(priceId);
		if (!plan) {
			throw new NotFoundError(
				`Subscription plan with Stripe Price ID '${priceId}' not found in database.`,
			);
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
		const finalSuccessUrl =
			successUrl || `${frontendUrl}/admin/projects?upgraded=true`;
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
