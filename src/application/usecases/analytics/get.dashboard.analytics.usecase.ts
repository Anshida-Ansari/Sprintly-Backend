import type { IAnalyticsRepository } from "@infrastructure/db/repository/interface/analytics.interface";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import { inject, injectable } from "inversify";

@injectable()
export class GetDashboardAnalyticsUseCase {
	constructor(
		@inject(ANALYTICS_TYPES.IAnalyticsRepository)
		private readonly analyticsRepository: IAnalyticsRepository,
	) {}

	async execute(companyId: string, filters: Record<string, unknown>) {
		if (!companyId) {
			throw new Error("companyId is required");
		}
		return await this.analyticsRepository.getDashboardAnalytics(
			companyId,
			filters,
		);
	}
}
