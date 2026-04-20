import type { IAnalyticsRepository } from "@infrastructure/db/repository/interface/analytics.interface";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import { inject, injectable } from "inversify";

@injectable()
export class GetUserBurndownUseCase {
	constructor(
		@inject(ANALYTICS_TYPES.IAnalyticsRepository)
		private readonly analyticsRepository: IAnalyticsRepository,
	) {}

	async execute(
		sprintId: string,
		userId: string,
		type: "hours" | "points" = "hours",
	) {
		if (!sprintId) {
			throw new Error("sprintId is required");
		}
		if (!userId) {
			throw new Error("userId is required");
		}
		return await this.analyticsRepository.getUserBurndown(
			sprintId,
			userId,
			type,
		);
	}
}
