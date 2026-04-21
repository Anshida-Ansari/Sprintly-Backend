import { inject, injectable } from "inversify";
import type { ISubscriptionPlanRepository } from "../interface/subscription.plan.interface";
import { SubscriptionPlanModel } from "../../schema/subscription.plan.schema";
import { SubscriptionPlanEntity } from "../../../../domain/entities/subscription.plan.entity";
import { SubscriptionPlanMapper } from "../../../mappers/subscription.plan.mapper";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../di/types/subscription-plan/subscription.plan.types";

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanMapper)
		private _mapper: SubscriptionPlanMapper,
	) {}

	async create(data: any): Promise<SubscriptionPlanEntity> {
		const newPlan = await SubscriptionPlanModel.create(data);
		return this._mapper.toEntity(newPlan)!;
	}

	async update(id: string, data: Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null> {
		const updated = await SubscriptionPlanModel.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true }
		);
		return updated ? this._mapper.toEntity(updated) : null;
	}

	async findById(id: string): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findById(id);
		return plan ? this._mapper.toEntity(plan) : null;
	}

	async findByName(name: string): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findOne({ name });
		return plan ? this._mapper.toEntity(plan) : null;
	}

	async findByStripePriceId(stripePriceId: string): Promise<SubscriptionPlanEntity | null> {
		const plan = await SubscriptionPlanModel.findOne({ stripePriceId });
		return plan ? this._mapper.toEntity(plan) : null;
	}

	async findAll(filter: any = {}): Promise<SubscriptionPlanEntity[]> {
		const plans = await SubscriptionPlanModel.find(filter).sort({ price: 1 });
		return plans.map((plan) => this._mapper.toEntity(plan)!);
	}

	async delete(id: string): Promise<boolean> {
		const result = await SubscriptionPlanModel.findByIdAndDelete(id);
		return !!result;
	}
}
