import { inject, injectable } from "inversify";
import type { SubscriptionPlanEntity } from "../../../../domain/entities/subscription.plan.entity.js";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../di/types/subscription-plan/subscription.plan.types.js";
import type { SubscriptionPlanMapper } from "../../../mappers/subscription.plan.mapper.js";
import { SubscriptionPlanModel } from "../../schema/subscription.plan.schema.js";
import type { ISubscriptionPlanRepository } from "../interface/subscription.plan.interface.js";

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanMapper)
		private _mapper: SubscriptionPlanMapper,
	) {}

	async create(data: {
		name: string;
		price: number;
		stripePriceId?: string;
		projectLimit: number;
		features: Array<{ text: string; included: boolean }>;
		isActive: boolean;
		isPopular?: boolean;
	}): Promise<SubscriptionPlanEntity> {
		const newPlan = await SubscriptionPlanModel.create(data);
		const entity = this._mapper.toEntity(
			newPlan.toObject() as Record<string, unknown>,
		);
		if (!entity) throw new Error("Failed to create subscription plan entity");
		return entity;
	}

	async update(
		id: string,
		data: Partial<SubscriptionPlanEntity>,
	): Promise<SubscriptionPlanEntity | null> {
		const updated = await SubscriptionPlanModel.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true },
		);
		return updated
			? this._mapper.toEntity(updated.toObject() as Record<string, unknown>)
			: null;
	}

	async findById(id: string): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findById(id);
		return plan
			? this._mapper.toEntity(plan.toObject() as Record<string, unknown>)
			: null;
	}

	async findByName(name: string): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findOne({ name });
		return plan
			? this._mapper.toEntity(plan.toObject() as Record<string, unknown>)
			: null;
	}

	async findByStripePriceId(
		stripePriceId: string,
	): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findOne({ stripePriceId });
		return plan
			? this._mapper.toEntity(plan.toObject() as Record<string, unknown>)
			: null;
	}

	async findAll(
		filter: Record<string, unknown> = {},
	): Promise<SubscriptionPlanEntity[]> {
		const plans = await SubscriptionPlanModel.find(filter).sort({ price: 1 });
		return plans
			.map((plan) => this._mapper.toEntity(plan.toObject()))
			.filter((entity): entity is SubscriptionPlanEntity => !!entity);
	}

	async delete(id: string): Promise<boolean> {
		const result = await SubscriptionPlanModel.findByIdAndDelete(id);
		return !!result;
	}
}
