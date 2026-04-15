import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ListCompanyUseCase } from "../../../application/usecases/superadmin/implementation/list.companies.usecase";
import type { IGetDashboardStatsUseCase } from "../../../application/usecases/superadmin/interface/get.dashboard.stats.interface";
import type { IGetDetailPageUseCase } from "../../../application/usecases/superadmin/interface/get.detailpage.interface";
import type { IUpdateStatusInterface } from "../../../application/usecases/superadmin/interface/update.status.interface";
import type { IGetSubscriptionAnalyticsUseCase } from "../../../application/usecases/subscription/implementation/get.subscription.analytics.usecase";
import type { IGetRevenueAnalyticsUseCase, IGetSubscriptionMetricsUseCase, IGetPlatformAnalyticsUseCase } from "../../../application/usecases/superadmin/interface/get.analytics.interface";
import type { IGetSubscriptionReportsUseCase } from "../../../application/usecases/superadmin/interface/get.reports.interface";
import type { GetTopCompaniesUseCase } from "../../../application/usecases/superadmin/implementation/get.top.companies.usecase";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { SUPERADMIN_TYPES } from "../../../infrastructure/di/types/superadmin/superadmin.types";

@injectable()
export class SuperAdminController {
	constructor(
		@inject(SUPERADMIN_TYPES.IListCompanyUseCase)
		private _listCompanyUseCase: ListCompanyUseCase,
		@inject(SUPERADMIN_TYPES.IUpdateStatusInterface)
		private _updateStatusUseCase: IUpdateStatusInterface,
		@inject(SUPERADMIN_TYPES.IGetDetailPageUseCase)
		private _getDetailPageUseCase: IGetDetailPageUseCase,
		@inject(SUPERADMIN_TYPES.IGetDashboardStatsUseCase)
		private _getDashboardStatsUseCase: IGetDashboardStatsUseCase,
		@inject(SUPERADMIN_TYPES.IGetSubscriptionAnalyticsUseCase)
		private _getSubscriptionAnalyticsUseCase: IGetSubscriptionAnalyticsUseCase,
		@inject(SUPERADMIN_TYPES.IGetRevenueAnalyticsUseCase)
		private _getRevenueAnalyticsUseCase: IGetRevenueAnalyticsUseCase,
		@inject(SUPERADMIN_TYPES.IGetSubscriptionMetricsUseCase)
		private _getSubscriptionMetricsUseCase: IGetSubscriptionMetricsUseCase,
		@inject(SUPERADMIN_TYPES.IGetTopCompaniesUseCase)
		private _getTopCompaniesUseCase: GetTopCompaniesUseCase,
		@inject(SUPERADMIN_TYPES.IGetSubscriptionReportsUseCase)
		private _getSubscriptionReportsUseCase: IGetSubscriptionReportsUseCase,
		@inject(SUPERADMIN_TYPES.IGetPlatformAnalyticsUseCase)
		private _getPlatformAnalyticsUseCase: IGetPlatformAnalyticsUseCase,
	) {}

	async listCompanies(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, search } = req.query;

			const query = {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
				search: search ? String(search) : "",
			};

			const response = await this._listCompanyUseCase.execute(query);
			return res.status(SuccessStatus.OK).json({
				success: true,
				...response,
			});
		} catch (error) {
			next(error);
		}
	}
	async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.params;
			const { status } = req.body;

			const result = await this._updateStatusUseCase.execute(companyId, status);

			res.status(SuccessStatus.OK).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
	async getDetailPage(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.params;

			const company = await this._getDetailPageUseCase.execute(companyId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: company,
			});
		} catch (error) {
			next(error);
		}
	}

	async getDashboardStats(req: Request, res: Response, next: NextFunction) {
		try {
			const stats = await this._getDashboardStatsUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	}

	async getSubscriptionAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const analytics = await this._getSubscriptionAnalyticsUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: analytics,
			});
		} catch (error) {
			next(error);
		}
	}

	async getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const analytics = await this._getRevenueAnalyticsUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: analytics,
			});
		} catch (error) {
			next(error);
		}
	}

	async getSubscriptionMetrics(req: Request, res: Response, next: NextFunction) {
		try {
			const metrics = await this._getSubscriptionMetricsUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: metrics,
			});
		} catch (error) {
			next(error);
		}
	}

	async getTopCompanies(req: Request, res: Response, next: NextFunction) {
		try {
			const topCompanies = await this._getTopCompaniesUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: topCompanies,
			});
		} catch (error) {
			next(error);
		}
	}

	async getSubscriptionReport(req: Request, res: Response, next: NextFunction) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const result = await this._getSubscriptionReportsUseCase.getSubscriptions(page, limit);
			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getPaymentReport(req: Request, res: Response, next: NextFunction) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const result = await this._getSubscriptionReportsUseCase.getPayments(page, limit);
			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getExpiringSoonReport(req: Request, res: Response, next: NextFunction) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const result = await this._getSubscriptionReportsUseCase.getExpiringSoon(page, limit);
			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getTrialReport(req: Request, res: Response, next: NextFunction) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const result = await this._getSubscriptionReportsUseCase.getTrials(page, limit);
			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getPlatformAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const analytics = await this._getPlatformAnalyticsUseCase.execute();
			return res.status(SuccessStatus.OK).json({
				success: true,
				data: analytics,
			});
		} catch (error) {
			next(error);
		}
	}
}
