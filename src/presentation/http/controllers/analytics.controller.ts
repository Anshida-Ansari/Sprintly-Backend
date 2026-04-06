import { inject, injectable } from "inversify";
import type { NextFunction, Request, Response } from "express";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import type { GetSprintBurndownUseCase } from "@application/usecases/analytics/get.sprint.burndown.usecase";
import type { GetUserBurndownUseCase } from "@application/usecases/analytics/get.user.burndown.usecase";

@injectable()
export class AnalyticsController {
	constructor(
		@inject(ANALYTICS_TYPES.IGetSprintBurndownUseCase)
		private readonly getSprintBurndownUseCase: GetSprintBurndownUseCase,
		@inject(ANALYTICS_TYPES.IGetUserBurndownUseCase)
		private readonly getUserBurndownUseCase: GetUserBurndownUseCase
	) {}

	async getSprintBurndown(req: Request, res: Response, next: NextFunction) {
		try {
			const { sprintId } = req.params;
			const data = await this.getSprintBurndownUseCase.execute(sprintId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserBurndown(req: Request, res: Response, next: NextFunction) {
		try {
			const { sprintId } = req.params;
			const userId = req.user.id;
			
			const data = await this.getUserBurndownUseCase.execute(sprintId, userId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data
			});
		} catch (error) {
			next(error);
		}
	}
}
