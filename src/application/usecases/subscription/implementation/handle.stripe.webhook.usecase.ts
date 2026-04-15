import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { TRANSACTION_TYPES } from "@infrastructure/di/types/transaction/transaction.types";
import type { ITransactionRepository } from "@infrastructure/db/repository/interface/transaction.interface";
import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { PROJECT_LIMITS, SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";
import type { IHandleStripeWebhookUseCase } from "../interface/handle.stripe.webhook.interface";

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
	private _stripe: any;

	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(TRANSACTION_TYPES.ITransactionRepository)
		private _transactionRepository: ITransactionRepository,
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

	async execute(rawBody: Buffer, signature: string): Promise<void> {
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
		if (!webhookSecret) {
			throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
		}

		let event: any;

		try {
			event = this._stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
		} catch (err: any) {
			throw new Error(`Webhook Error: ${err.message}`);
		}

		console.log(`[Stripe Webhook] Received event: ${event.type}`);

		switch (event.type) {
			// ─── Initial Checkout Completed ───────────────────────────────────
			case "checkout.session.completed": {
				const session = event.data.object as any;
				const companyId = session.metadata?.companyId;
				if (!companyId) {
					console.error("[Stripe Webhook] Missing companyId in session metadata");
					return;
				}

				const stripeCustomerId = session.customer as string;
				const stripeSubscriptionId = session.subscription as string;
				const proLimit = PROJECT_LIMITS[SubscriptionPlan.PRO];

				// Calculate end date (30 days from now as fallback, will be overridden by invoice event)
				const endDate = new Date();
				endDate.setDate(endDate.getDate() + 30);

				await this._companyRepository.updatePlan(
					companyId,
					SubscriptionPlan.PRO,
					proLimit,
					stripeCustomerId,
					stripeSubscriptionId,
					endDate,
					true, // autoRenew defaults to true
				);

				// Log transaction
				await this._transactionRepository.create({
					stripePaymentId: session.id, // During checkout, the session ID is our tracking point or we could wait for invoice
					stripeCustomerId,
					companyId,
					amount: (session.amount_total || 0) / 100,
					currency: session.currency || "INR",
					status: "succeeded",
					billingReason: "subscription_create",
				});

				console.log(`[Stripe Webhook] Company ${companyId} upgraded to PRO`);
				break;
			}

			// ─── Monthly Renewal Paid Successfully ────────────────────────────
			case "invoice.payment_succeeded": {
				const invoice = event.data.object as any;
				const customerId = invoice.customer as string;
				const subscriptionId = invoice.subscription as string;

				// Find company by stripeCustomerId
				const company = await this._companyRepository.findByStripeCustomerId(customerId);

				if (company && company.id) {
					// Log transaction for every successful payment
					await this._transactionRepository.create({
						stripePaymentId: invoice.id,
						stripeCustomerId: customerId,
						companyId: company.id,
						amount: invoice.amount_paid / 100,
						currency: invoice.currency,
						status: "succeeded",
						billingReason: invoice.billing_reason,
					});

					// If it's a subscription renewal, update the end date
					if (subscriptionId && invoice.billing_reason !== "subscription_create") {
						const subscription = await this._stripe.subscriptions.retrieve(subscriptionId);
						const periodEnd = new Date(subscription.current_period_end * 1000);
						const proLimit = PROJECT_LIMITS[SubscriptionPlan.PRO];

						await this._companyRepository.updatePlan(
							company.id,
							SubscriptionPlan.PRO,
							proLimit,
							customerId,
							subscriptionId,
							periodEnd,
						);
						console.log(`[Stripe Webhook] Company ${company.id} renewed PRO until ${periodEnd.toISOString()}`);
					}
				}
				break;
			}

			// ─── Payment Failed (card declined / expired) ─────────────────────
			case "invoice.payment_failed": {
				const invoice = event.data.object as any;
				const customerId = invoice.customer as string;

				const company = await this._companyRepository.findByStripeCustomerId(customerId);

				if (company && company.id) {
					const freeLimit = PROJECT_LIMITS[SubscriptionPlan.FREE];
					await this._companyRepository.updatePlan(
						company.id,
						SubscriptionPlan.FREE,
						freeLimit,
					);
					console.log(`[Stripe Webhook] Company ${company.id} downgraded to FREE (payment failed)`);
				}
				break;
			}

			// ─── Subscription Cancelled / Deleted ────────────────────────────
			case "customer.subscription.deleted": {
				const subscription = event.data.object as any;
				const customerId = subscription.customer as string;

				const company = await this._companyRepository.findByStripeCustomerId(customerId);

				if (company && company.id) {
					const freeLimit = PROJECT_LIMITS[SubscriptionPlan.FREE];
					await this._companyRepository.updatePlan(
						company.id,
						SubscriptionPlan.FREE,
						freeLimit,
						undefined,
						undefined,
						undefined,
						false, // autoRenew OFF
					);
					console.log(`[Stripe Webhook] Company ${company.id} downgraded to FREE (subscription cancelled)`);
				}
				break;
			}

			// ─── Subscription Updated (e.g., auto-renew toggled) ──────────────
			case "customer.subscription.updated": {
				const subscription = event.data.object as any;
				const customerId = subscription.customer as string;
				const autoRenew = !subscription.cancel_at_period_end;

				const company = await this._companyRepository.findByStripeCustomerId(customerId);
				if (company && company.id) {
					await this._companyRepository.updatePlan(
						company.id,
						company.currentPlan,
						company.projectLimit,
						customerId,
						subscription.id,
						company.subscriptionEndDate,
						autoRenew,
					);
					console.log(`[Stripe Webhook] Company ${company.id} autoRenew set to ${autoRenew}`);
				}
				break;
			}

			default:
				console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
		}
	}
}
