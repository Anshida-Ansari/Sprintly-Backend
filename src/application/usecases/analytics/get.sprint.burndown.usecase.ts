import type { IAnalyticsRepository } from "@infrastructure/db/repository/interface/analytics.interface";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import { inject, injectable } from "inversify";

@injectable()
export class GetSprintBurndownUseCase {
	constructor(
		@inject(ANALYTICS_TYPES.IAnalyticsRepository)
		private readonly analyticsRepository: IAnalyticsRepository,
	) {}

	async execute(sprintId: string) {
		if (!sprintId) {
			throw new Error("sprintId is required");
		}
		return await this.analyticsRepository.getSprintBurndown(sprintId);
	}
}
