import type { SubscriptionPlanEntity } from "../../../domain/entities/subscription.plan.entity.js";

export interface ISubscriptionPlanMapper {
	toEntity(
		data: Record<string, unknown> | null | undefined,
	): SubscriptionPlanEntity | null;
	toMongo(entity: SubscriptionPlanEntity): Record<string, unknown>;
}
