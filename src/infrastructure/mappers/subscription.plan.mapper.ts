import { injectable } from "inversify";
import { SubscriptionPlanEntity } from "../../domain/entities/subscription.plan.entity.js";
import type { ISubscriptionPlanMapper } from "./interface/subscription.plan.mapper.interface.js";

@injectable()
export class SubscriptionPlanMapper implements ISubscriptionPlanMapper {
	toEntity(
		data: Record<string, unknown> | null | undefined,
	): SubscriptionPlanEntity | null {
		if (!data) return null;
		return new SubscriptionPlanEntity({
			id:
				(data as { _id?: { toString(): string } })._id?.toString() ||
				(data as { id?: string }).id,
			name: data.name as string,
			price: data.price as number,
			stripePriceId: data.stripePriceId as string,
			projectLimit: data.projectLimit as number,
			features: data.features as Array<{ text: string; included: boolean }>,
			isActive: data.isActive as boolean,
			isPopular: data.isPopular as boolean,
			createdAt: data.createdAt as Date,
			updatedAt: data.updatedAt as Date,
		});
	}

	toMongo(entity: SubscriptionPlanEntity): Record<string, unknown> {
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

	toResponse(entity: SubscriptionPlanEntity): Record<string, unknown> {
		return {
			id: entity.id,
			name: entity.name,
			price: entity.price,
			stripePriceId: entity.stripePriceId,
			projectLimit: entity.projectLimit,
			features: entity.features,
			isActive: entity.isActive,
			isPopular: entity.isPopular,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
