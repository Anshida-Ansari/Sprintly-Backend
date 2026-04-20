import type { GetDashboardAnalyticsUseCase } from "@application/usecases/analytics/get.dashboard.analytics.usecase";
import type { GetSprintBurndownUseCase } from "@application/usecases/analytics/get.sprint.burndown.usecase";
import type { GetUserBurndownUseCase } from "@application/usecases/analytics/get.user.burndown.usecase";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AnalyticsController {
	constructor(
		@inject(ANALYTICS_TYPES.IGetSprintBurndownUseCase)
		private readonly getSprintBurndownUseCase: GetSprintBurndownUseCase,
		@inject(ANALYTICS_TYPES.IGetUserBurndownUseCase)
		private readonly getUserBurndownUseCase: GetUserBurndownUseCase,
		@inject(ANALYTICS_TYPES.IGetDashboardAnalyticsUseCase)
		private readonly getDashboardAnalyticsUseCase: GetDashboardAnalyticsUseCase,
	) {}

	async getSprintBurndown(req: Request, res: Response, next: NextFunction) {
		try {
			const { sprintId } = req.params;
			const { type } = req.query;
			const data = await this.getSprintBurndownUseCase.execute(
				sprintId,
				type as "hours" | "points",
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserBurndown(req: Request, res: Response, next: NextFunction) {
		try {
			const { sprintId } = req.params;
			const { type } = req.query;
			const userId = req.user.id;

			const data = await this.getUserBurndownUseCase.execute(
				sprintId,
				userId,
				type as "hours" | "points",
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async getDashboardAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = { ...req.query, ...req.params };
			const data = await this.getDashboardAnalyticsUseCase.execute(
				companyId,
				filters,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}
}
