import { SubscriptionPlanEntity } from "../../../domain/entities/subscription.plan.entity";
import { injectable } from "inversify";
import type { ISubscriptionPlanMapper } from "./interface/subscription.plan.mapper.interface";

@injectable()
export class SubscriptionPlanMapper implements ISubscriptionPlanMapper {
	toEntity(data: any): SubscriptionPlanEntity | null {
		if (!data) return null;
		return new SubscriptionPlanEntity({
			id: data._id?.toString() || data.id,
			name: data.name,
			price: data.price,
			stripePriceId: data.stripePriceId,
			projectLimit: data.projectLimit,
			features: data.features,
			isActive: data.isActive,
			isPopular: data.isPopular,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}

	toMongo(entity: SubscriptionPlanEntity): any {
		return {
			...(entity.id && { _id: entity.id }),
			name: entity.name,
			price: entity.price,
			stripePriceId: entity.stripePriceId,
			projectLimit: entity.projectLimit,
			features: entity.features,
			isActive: entity.isActive,
			isPopular: entity.isPopular,
		};
	}
}
