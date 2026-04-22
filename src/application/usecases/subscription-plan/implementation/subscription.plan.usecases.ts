import { inject, injectable } from "inversify";
import type { ICreateSubscriptionPlanUseCase, IListSubscriptionPlansUseCase, IUpdateSubscriptionPlanUseCase, IDeleteSubscriptionPlanUseCase } from "../interface/subscription.plan.usecases.interface.js";
import type { ISubscriptionPlanRepository } from "../../../../infrastructure/db/repository/interface/subscription.plan.interface.js";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../../infrastructure/di/types/subscription-plan/subscription.plan.types.js";
import type { SubscriptionPlanEntity } from "../../../../domain/entities/subscription.plan.entity.js";

@injectable()
export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _repository: ISubscriptionPlanRepository
	) {}

	async execute(data: Parameters<ICreateSubscriptionPlanUseCase["execute"]>["0"]): Promise<SubscriptionPlanEntity> {
		return this._repository.create(data);
	}
}

@injectable()
export class ListSubscriptionPlansUseCase implements IListSubscriptionPlansUseCase {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _repository: ISubscriptionPlanRepository
	) {}

	async execute(onlyActive = false): Promise<SubscriptionPlanEntity[]> {
		const filter = onlyActive ? { isActive: true } : {};
		return this._repository.findAll(filter);
	}
}

@injectable()
export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _repository: ISubscriptionPlanRepository
	) {}

	async execute(id: string, data: Parameters<IUpdateSubscriptionPlanUseCase["execute"]>["1"]): Promise<SubscriptionPlanEntity> {
		const updated = await this._repository.update(id, data);
		if (!updated) {
			throw new Error("Subscription plan not found");
		}
		return updated;
	}
}

@injectable()
export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _repository: ISubscriptionPlanRepository
	) {}

	async execute(id: string): Promise<boolean> {
		return this._repository.delete(id);
	}
}
