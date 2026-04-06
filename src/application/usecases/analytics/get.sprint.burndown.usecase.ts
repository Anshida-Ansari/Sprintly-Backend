import { inject, injectable } from "inversify";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import { IAnalyticsRepository } from "@infrastructure/db/repository/interface/analytics.interface";

@injectable()
export class GetSprintBurndownUseCase {
	constructor(
		@inject(ANALYTICS_TYPES.IAnalyticsRepository)
		private readonly analyticsRepository: IAnalyticsRepository
	) {}

	async execute(sprintId: string) {
		if (!sprintId) {
			throw new Error("sprintId is required");
		}
		return await this.analyticsRepository.getSprintBurndown(sprintId);
	}
}
