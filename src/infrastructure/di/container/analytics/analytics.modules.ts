// import { ContainerModule, interfaces } from "inversify";

import { AnalyticsRepository } from "@infrastructure/db/repository/implements/analytics.repository";
import { ContainerModule } from "inversify";
import { GetSprintBurndownUseCase } from "../../../../application/usecases/analytics/get.sprint.burndown.usecase";
import { GetUserBurndownUseCase } from "../../../../application/usecases/analytics/get.user.burndown.usecase";
import { GetDashboardAnalyticsUseCase } from "../../../../application/usecases/analytics/get.dashboard.analytics.usecase";
import { AnalyticsController } from "../../../../presentation/http/controllers/analytics.controller";
import { ANALYTICS_TYPES } from "../../types/analytics/analytics.types";

export const AnalyticsModule = new ContainerModule(({ bind }) => {
	// Repositories
	bind(ANALYTICS_TYPES.IAnalyticsRepository).to(AnalyticsRepository);

	// Use Cases
	bind(ANALYTICS_TYPES.IGetSprintBurndownUseCase).to(GetSprintBurndownUseCase);
	bind(ANALYTICS_TYPES.IGetUserBurndownUseCase).to(GetUserBurndownUseCase);
	bind(ANALYTICS_TYPES.IGetDashboardAnalyticsUseCase).to(GetDashboardAnalyticsUseCase);

	// Controllers
	bind(ANALYTICS_TYPES.AnalyticsController).to(AnalyticsController);
});
