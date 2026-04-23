import type { SubscriptionPlanEntity } from "../../../../domain/entities/subscription.plan.entity.js";

export interface ISubscriptionPlanRepository {
	create(data: {
		name: string;
		price: number;
		stripePriceId?: string;
		projectLimit: number;
		features: Array<{ text: string; included: boolean }>;
		isActive: boolean;
		isPopular?: boolean;
	}): Promise<SubscriptionPlanEntity>;
	update(
		id: string,
		data: Partial<SubscriptionPlanEntity>,
	): Promise<SubscriptionPlanEntity | null>;
	findById(id: string): Promise<SubscriptionPlanEntity | null>;
	findByName(name: string): Promise<SubscriptionPlanEntity | null>;
	findByStripePriceId(
		stripePriceId: string,
	): Promise<SubscriptionPlanEntity | null>;
	findAll(filter?: Record<string, unknown>): Promise<SubscriptionPlanEntity[]>;
	delete(id: string): Promise<boolean>;
}
