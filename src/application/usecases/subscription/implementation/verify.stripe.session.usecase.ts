import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import type { IVerifyStripeSessionUseCase } from "../interface/verify.stripe.session.interface";

@injectable()
export class VerifyStripeSessionUseCase implements IVerifyStripeSessionUseCase {
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
			apiVersion: "2024-06-20" as any,
			typescript: true,
		});
	}

	async execute(sessionId: string, companyId: string) {
		const company = await this._companyRepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		try {
			// 1. Retrieve the session from Stripe
			const session = await this._stripe.checkout.sessions.retrieve(sessionId, {
				expand: ['subscription']
			});

			if (session.payment_status !== "paid" || session.metadata?.companyId !== companyId) {
				return {
					success: false,
					message: "Session not paid or invalid",
					currentPlan: company.currentPlan,
				};
			}

			// 2. Get the Price ID from the subscription
			const subscription = session.subscription as Stripe.Subscription;
			const priceId = subscription.items.data[0]?.price.id;

			if (!priceId) {
				throw new Error("No Price ID found in Stripe session");
			}

			// 3. Find the matching dynamic plan in our database
			const plan = await this._subscriptionPlanRepository.findByStripePriceId(priceId);
			if (!plan) {
				throw new NotFoundError(`Subscription plan with Price ID '${priceId}' not found in database. Please ensure the plan exists in Super Admin.`);
			}

			// 4. Update the company with the EXACT plan details
			await this._companyRepository.updatePlan(
				companyId,
				plan.name,
				plan.projectLimit,
				session.customer as string,
				subscription.id,
				new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
				true
			);

			return {
				success: true,
				message: `Successfully upgraded to ${plan.name}`,
				currentPlan: plan.name,
			};
		} catch (error: unknown) {
			const err = error as Error;
			console.error("Stripe session verification error:", err);
			throw new Error(`Failed to verify Stripe session: ${err.message}`);
		}
	}
}
