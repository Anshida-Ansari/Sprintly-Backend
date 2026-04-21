import { SubscriptionPlanEntity } from "../../../domain/entities/subscription.plan.entity";

export interface ISubscriptionPlanMapper {
	toEntity(data: any): SubscriptionPlanEntity | null;
	toMongo(entity: SubscriptionPlanEntity): any;
}
