import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../infrastructure/di/types/subscription-plan/subscription.plan.types.js";
import type {
	ICreateSubscriptionPlanUseCase,
	IListSubscriptionPlansUseCase,
	IUpdateSubscriptionPlanUseCase,
	IDeleteSubscriptionPlanUseCase,
} from "../../../application/usecases/subscription-plan/interface/subscription.plan.usecases.interface.js";
import type { SubscriptionPlanMapper } from "../../../infrastructure/mappers/subscription.plan.mapper.js";

@injectable()
export class SubscriptionPlanController {
	constructor(
		@inject(SUBSCRIPTION_PLAN_TYPES.ICreateSubscriptionPlanUseCase)
		private _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
		@inject(SUBSCRIPTION_PLAN_TYPES.IListSubscriptionPlansUseCase)
		private _listSubscriptionPlansUseCase: IListSubscriptionPlansUseCase,
		@inject(SUBSCRIPTION_PLAN_TYPES.IUpdateSubscriptionPlanUseCase)
		private _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
		@inject(SUBSCRIPTION_PLAN_TYPES.IDeleteSubscriptionPlanUseCase)
		private _deleteSubscriptionPlanUseCase: IDeleteSubscriptionPlanUseCase,
		@inject(SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanMapper)
		private _mapper: SubscriptionPlanMapper,
	) {}

	async createPlan(req: Request, res: Response) {
		try {
			const plan = await this._createSubscriptionPlanUseCase.execute(req.body);
			res.status(201).json(this._mapper.toResponse(plan));
		} catch (error: unknown) {
			res.status(400).json({ message: (error as Error).message });
		}
	}

	async listPlans(req: Request, res: Response) {
		try {
			const onlyActive = req.query.active === "true";
			const plans = await this._listSubscriptionPlansUseCase.execute(onlyActive);
			res.status(200).json(plans.map(p => this._mapper.toResponse(p)));
		} catch (error: unknown) {
			res.status(500).json({ message: (error as Error).message });
		}
	}

	async updatePlan(req: Request, res: Response) {
		try {
			const plan = await this._updateSubscriptionPlanUseCase.execute(req.params.id, req.body);
			res.status(200).json(this._mapper.toResponse(plan));
		} catch (error: unknown) {
			res.status(400).json({ message: (error as Error).message });
		}
	}

	async deletePlan(req: Request, res: Response) {
		try {
			await this._deleteSubscriptionPlanUseCase.execute(req.params.id);
			res.status(204).send();
		} catch (error: unknown) {
			res.status(400).json({ message: (error as Error).message });
		}
	}
}
