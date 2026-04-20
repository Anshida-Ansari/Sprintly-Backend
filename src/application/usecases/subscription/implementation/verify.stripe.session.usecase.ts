import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { inject, injectable } from "inversify";
import Stripe from "stripe";
import {
	PROJECT_LIMITS,
	SubscriptionPlan,
} from "../../../../domain/enum/company/subscription.plan.enum";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import type { IVerifyStripeSessionUseCase } from "../interface/verify.stripe.session.interface";

@injectable()
export class VerifyStripeSessionUseCase implements IVerifyStripeSessionUseCase {
	private _stripe: Stripe;

	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {
		const secretKey = process.env.STRIPE_SECRET_KEY;
		if (!secretKey) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		this._stripe = new Stripe(secretKey, {
			apiVersion: "2024-06-20",
			typescript: true,
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

			if (
				session.payment_status === "paid" &&
				session.metadata?.companyId === companyId
			) {
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
		} catch (error: unknown) {
			const err = error as Error;
			console.error("Stripe session verification error:", err);
			throw new Error(`Failed to verify Stripe session: ${err.message}`);
		}
	}
}
