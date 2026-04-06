import { inject, injectable } from "inversify";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import { IAnalyticsRepository } from "@infrastructure/db/repository/interface/analytics.interface";

@injectable()
export class GetUserBurndownUseCase {
	constructor(
		@inject(ANALYTICS_TYPES.IAnalyticsRepository)
		private readonly analyticsRepository: IAnalyticsRepository
	) {}

	async execute(sprintId: string, userId: string) {
		if (!sprintId) {
			throw new Error("sprintId is required");
		}
		if (!userId) {
			throw new Error("userId is required");
		}
		return await this.analyticsRepository.getUserBurndown(sprintId, userId);
	}
}
