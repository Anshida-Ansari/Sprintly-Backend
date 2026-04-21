import { SubscriptionPlanEntity } from "../../../domain/entities/subscription.plan.entity";

export interface ISubscriptionPlanRepository {
	create(data: any): Promise<SubscriptionPlanEntity>;
	update(id: string, data: Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null>;
	findById(id: string): Promise<SubscriptionPlanEntity | null>;
	findByName(name: string): Promise<SubscriptionPlanEntity | null>;
	findByStripePriceId(stripePriceId: string): Promise<SubscriptionPlanEntity | null>;
	findAll(filter?: any): Promise<SubscriptionPlanEntity[]>;
	delete(id: string): Promise<boolean>;
}
