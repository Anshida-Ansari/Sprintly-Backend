import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { inject, injectable } from "inversify";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { PROJECT_LIMITS, SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import Stripe from "stripe";
import type { IVerifyStripeSessionUseCase } from "../interface/verify.stripe.session.interface";

@injectable()
export class VerifyStripeSessionUseCase implements IVerifyStripeSessionUseCase {
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

	async execute(sessionId: string, companyId: string) {
		const company = await this._companyRepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		// If already pro, just return
		if (company.currentPlan === SubscriptionPlan.PRO) {
			return {
				success: true,
				message: "Already on Pro plan",
				currentPlan: SubscriptionPlan.PRO,
			};
		}

		try {
			// Retrieve the session from Stripe
			const session = await this._stripe.checkout.sessions.retrieve(sessionId);

			if (session.payment_status === "paid" && session.metadata?.companyId === companyId) {
				const stripeCustomerId = session.customer as string;
				const stripeSubscriptionId = session.subscription as string;
				const proLimit = PROJECT_LIMITS[SubscriptionPlan.PRO];

				await this._companyRepository.updatePlan(
					companyId,
					SubscriptionPlan.PRO,
					proLimit,
					stripeCustomerId,
					stripeSubscriptionId,
				);

				return {
					success: true,
					message: "Successfully verified and upgraded to Pro",
					currentPlan: SubscriptionPlan.PRO,
				};
			}

			return {
				success: false,
				message: "Session not paid or invalid",
				currentPlan: company.currentPlan,
			};
		} catch (error: any) {
			console.error("Stripe session verification error:", error);
			throw new Error(`Failed to verify Stripe session: ${error.message}`);
		}
	}
}
