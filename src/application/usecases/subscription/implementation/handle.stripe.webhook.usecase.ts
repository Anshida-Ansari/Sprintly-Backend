import { inject, injectable } from "inversify";
import Stripe from "stripe";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface.js";
import type { ISubscriptionPlanRepository } from "../../../../infrastructure/db/repository/interface/subscription.plan.interface.js";
import type { ITransactionRepository } from "../../../../infrastructure/db/repository/interface/transaction.interface.js";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types.js";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../../infrastructure/di/types/subscription-plan/subscription.plan.types.js";
import { TRANSACTION_TYPES } from "../../../../infrastructure/di/types/transaction/transaction.types.js";
import type { IHandleStripeWebhookUseCase } from "../interface/handle.stripe.webhook.interface.js";

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
	private _stripe: Stripe;
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(TRANSACTION_TYPES.ITransactionRepository)
		private _transactionRepository: ITransactionRepository,
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

	async execute(rawBody: Buffer, signature: string): Promise<void> {
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
		if (!webhookSecret) {
			throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
		}

		let event: Stripe.Event;

		try {
			event = this._stripe.webhooks.constructEvent(
				rawBody,
				signature,
				webhookSecret,
			);
		} catch (err: unknown) {
			const error = err as Error;
			throw new Error(`Webhook Error: ${error.message}`);
		}

		console.log(`[Stripe Webhook] Received event: ${event.type}`);

		switch (event.type) {
			// ─── Initial Checkout Completed ───────────────────────────────────
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				const companyId = session.metadata?.companyId;
				if (!companyId) {
					console.error(
						"[Stripe Webhook] Missing companyId in session metadata",
					);
					return;
				}

				const stripeCustomerId = session.customer as string;
				const stripeSubscriptionId = session.subscription as string;

				// Fetch subscription to get price ID
				const subscription =
					await this._stripe.subscriptions.retrieve(stripeSubscriptionId);
				const priceId = subscription.items.data[0]?.price.id;

				let planName = "Free"; // Default fallback if something goes wrong
				let projectLimit = 2;

				if (priceId) {
					const plan =
						await this._subscriptionPlanRepository.findByStripePriceId(priceId);
					if (plan) {
						planName = plan.name;
						projectLimit = plan.projectLimit;
					} else {
						console.error(
							`[Stripe Webhook] No matching dynamic plan found for priceId: ${priceId}`,
						);
						// If we can't find the plan by priceId, we might want to look for any plan with this priceId or logs
					}
				}

				// Calculate end date (will be overridden by invoice event later)
				const endDate = new Date(
					(subscription as unknown as { current_period_end: number })
						.current_period_end * 1000,
				);

				await this._companyRepository.updatePlan(
					companyId,
					planName,
					projectLimit,
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

				console.log(
					`[Stripe Webhook] Company ${companyId} upgraded to ${planName}`,
				);
				break;
			}

			// ─── Monthly Renewal Paid Successfully ────────────────────────────
			case "invoice.payment_succeeded": {
				const invoice = event.data.object as Stripe.Invoice;
				const customerId = invoice.customer as string;

				// Find company by stripeCustomerId
				const company =
					await this._companyRepository.findByStripeCustomerId(customerId);

				if (company?.id) {
					// Log transaction for every successful payment
					await this._transactionRepository.create({
						stripePaymentId: invoice.id as string,
						stripeCustomerId: customerId,
						companyId: company.id,
						amount: invoice.amount_paid / 100,
						currency: invoice.currency,
						status: "succeeded",
						billingReason: invoice.billing_reason || undefined,
					});

					// If it's a subscription renewal, update the end date
					if (
						(invoice as unknown as { subscription: string }).subscription &&
						invoice.billing_reason !== "subscription_create"
					) {
						const subscriptionId = (
							invoice as unknown as { subscription: string }
						).subscription;
						const subscription =
							await this._stripe.subscriptions.retrieve(subscriptionId);
						const periodEnd = new Date(
							(subscription as unknown as { current_period_end: number })
								.current_period_end * 1000,
						);
						const priceId = (
							invoice.lines.data[0] as unknown as { price?: { id: string } }
						)?.price?.id;
						let planName = company.currentPlan;
						let projectLimit = company.projectLimit;

						if (priceId) {
							const plan =
								await this._subscriptionPlanRepository.findByStripePriceId(
									priceId,
								);
							if (plan) {
								planName = plan.name;
								projectLimit = plan.projectLimit;
							}
						}

						await this._companyRepository.updatePlan(
							company.id,
							planName,
							projectLimit,
							customerId,
							subscriptionId,
							periodEnd,
						);
						console.log(
							`[Stripe Webhook] Company ${company.id} renewed plan ${planName} until ${periodEnd.toISOString()}`,
						);
					}
				}
				break;
			}

			// ─── Payment Failed (card declined / expired) ─────────────────────
			case "invoice.payment_failed": {
				const invoice = event.data.object as Stripe.Invoice;
				const customerId = invoice.customer as string;

				const company =
					await this._companyRepository.findByStripeCustomerId(customerId);

				if (company?.id) {
					// Fetch default free plan
					const allPlans = await this._subscriptionPlanRepository.findAll();
					const freePlan = allPlans.find((p) => p.price === 0);
					const freeLimit = freePlan ? freePlan.projectLimit : 2;
					const planName = freePlan ? freePlan.name : "free";

					await this._companyRepository.updatePlan(
						company.id,
						planName,
						freeLimit,
					);
					console.log(
						`[Stripe Webhook] Company ${company.id} downgraded to ${planName} (payment failed)`,
					);
				}
				break;
			}

			// ─── Subscription Cancelled / Deleted ────────────────────────────
			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;

				const company =
					await this._companyRepository.findByStripeCustomerId(customerId);

				if (company?.id) {
					// Fetch default free plan
					const allPlans = await this._subscriptionPlanRepository.findAll();
					const freePlan = allPlans.find((p) => p.price === 0);
					const freeLimit = freePlan ? freePlan.projectLimit : 2;
					const planName = freePlan ? freePlan.name : "free";

					await this._companyRepository.updatePlan(
						company.id,
						planName,
						freeLimit,
						undefined,
						undefined,
						undefined,
						false, // autoRenew OFF
					);
					console.log(
						`[Stripe Webhook] Company ${company.id} downgraded to ${planName} (subscription cancelled)`,
					);
				}
				break;
			}

			// ─── Subscription Updated (e.g., auto-renew toggled) ──────────────
			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;
				const autoRenew = !subscription.cancel_at_period_end;

				const company =
					await this._companyRepository.findByStripeCustomerId(customerId);
				if (company?.id) {
					await this._companyRepository.updatePlan(
						company.id,
						company.currentPlan,
						company.projectLimit,
						customerId,
						subscription.id,
						company.subscriptionEndDate,
						autoRenew,
					);
					console.log(
						`[Stripe Webhook] Company ${company.id} autoRenew set to ${autoRenew}`,
					);
				}
				break;
			}

			default:
				console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
		}
	}
}
