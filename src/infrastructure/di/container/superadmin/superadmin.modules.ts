import { ContainerModule } from "inversify";
import type { IGetSubscriptionAnalyticsUseCase } from "../../../../application/usecases/subscription/implementation/get.subscription.analytics.usecase";
import { GetSubscriptionAnalyticsUseCase } from "../../../../application/usecases/subscription/implementation/get.subscription.analytics.usecase";
import { GetDashboardStatsUseCase } from "../../../../application/usecases/superadmin/implementation/get.dashboard.stats.usecase";
import { GetDetailPageUseCase } from "../../../../application/usecases/superadmin/implementation/get.detailpage.usecase";
import { GetPlatformAnalyticsUseCase } from "../../../../application/usecases/superadmin/implementation/get.platform.analytics.usecase";
import { GetSubscriptionReportsUseCase } from "../../../../application/usecases/superadmin/implementation/get.reports.usecase";
import { GetRevenueAnalyticsUseCase } from "../../../../application/usecases/superadmin/implementation/get.revenue.analytics.usecase";
import { GetSubscriptionMetricsUseCase } from "../../../../application/usecases/superadmin/implementation/get.subscription.metrics.usecase";
import { GetTopCompaniesUseCase } from "../../../../application/usecases/superadmin/implementation/get.top.companies.usecase";
import { ListCompanyUseCase } from "../../../../application/usecases/superadmin/implementation/list.companies.usecase";
import { UpdateStatusUseCase } from "../../../../application/usecases/superadmin/implementation/update.status.usecase";
import type {
	IGetPlatformAnalyticsUseCase,
	IGetRevenueAnalyticsUseCase,
	IGetSubscriptionMetricsUseCase,
} from "../../../../application/usecases/superadmin/interface/get.analytics.interface";
import type { IGetDashboardStatsUseCase } from "../../../../application/usecases/superadmin/interface/get.dashboard.stats.interface";
import type { IGetDetailPageUseCase } from "../../../../application/usecases/superadmin/interface/get.detailpage.interface";
import type { IGetSubscriptionReportsUseCase } from "../../../../application/usecases/superadmin/interface/get.reports.interface";
import type { IListCompanyUseCase } from "../../../../application/usecases/superadmin/interface/list.companies.interface";
import type { IUpdateStatusInterface } from "../../../../application/usecases/superadmin/interface/update.status.interface";
import { SuperAdminController } from "../../../../presentation/http/controllers/superadmin.controller";
import { SUPERADMIN_TYPES } from "../../types/superadmin/superadmin.types";

export const SuperAdminModule = new ContainerModule(({ bind }) => {
	bind<IListCompanyUseCase>(SUPERADMIN_TYPES.IListCompanyUseCase).to(
		ListCompanyUseCase,
	);
	bind<SuperAdminController>(SUPERADMIN_TYPES.SuperAdminController).to(
		SuperAdminController,
	);
	bind<IUpdateStatusInterface>(SUPERADMIN_TYPES.IUpdateStatusInterface).to(
		UpdateStatusUseCase,
	);
	bind<IGetDetailPageUseCase>(SUPERADMIN_TYPES.IGetDetailPageUseCase).to(
		GetDetailPageUseCase,
	);
	bind<IGetDashboardStatsUseCase>(
		SUPERADMIN_TYPES.IGetDashboardStatsUseCase,
	).to(GetDashboardStatsUseCase);
	bind<IGetSubscriptionAnalyticsUseCase>(
		SUPERADMIN_TYPES.IGetSubscriptionAnalyticsUseCase,
	).to(GetSubscriptionAnalyticsUseCase);

	bind<IGetRevenueAnalyticsUseCase>(
		SUPERADMIN_TYPES.IGetRevenueAnalyticsUseCase,
	).to(GetRevenueAnalyticsUseCase);
	bind<IGetSubscriptionMetricsUseCase>(
		SUPERADMIN_TYPES.IGetSubscriptionMetricsUseCase,
	).to(GetSubscriptionMetricsUseCase);
	bind<GetTopCompaniesUseCase>(SUPERADMIN_TYPES.IGetTopCompaniesUseCase).to(
		GetTopCompaniesUseCase,
	);
	bind<IGetSubscriptionReportsUseCase>(
		SUPERADMIN_TYPES.IGetSubscriptionReportsUseCase,
	).to(GetSubscriptionReportsUseCase);
	bind<IGetPlatformAnalyticsUseCase>(
		SUPERADMIN_TYPES.IGetPlatformAnalyticsUseCase,
	).to(GetPlatformAnalyticsUseCase);
});
