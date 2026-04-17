import { inject, injectable } from "inversify";
import type { NextFunction, Request, Response } from "express";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import type { 
    IGetProjectReportsUseCase, 
    IGetSprintReportsUseCase, 
    IGetUserStoryReportsUseCase, 
    IGetSubtaskReportsUseCase, 
    IGetUserPerformanceReportsUseCase 
} from "@application/usecases/reports/interface/reports.usecase.interface";

@injectable()
export class ReportsController {
	constructor(
		@inject(REPORTS_TYPE.GetProjectReportsUseCase)
		private readonly getProjectReportsUseCase: IGetProjectReportsUseCase,
		@inject(REPORTS_TYPE.GetSprintReportsUseCase)
		private readonly getSprintReportsUseCase: IGetSprintReportsUseCase,
		@inject(REPORTS_TYPE.GetUserStoryReportsUseCase)
		private readonly getUserStoryReportsUseCase: IGetUserStoryReportsUseCase,
		@inject(REPORTS_TYPE.GetSubtaskReportsUseCase)
		private readonly getSubtaskReportsUseCase: IGetSubtaskReportsUseCase,
		@inject(REPORTS_TYPE.GetUserPerformanceReportsUseCase)
		private readonly getUserPerformanceReportsUseCase: IGetUserPerformanceReportsUseCase,
	) {}

    private getFilters(req: Request) {
        return {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            search: req.query.search ? String(req.query.search) : "",
            status: req.query.status ? String(req.query.status) : undefined,
            projectId: (req.params.projectId || req.query.projectId) ? String(req.params.projectId || req.query.projectId) : undefined,
            sprintId: (req.params.sprintId || req.query.sprintId) ? String(req.params.sprintId || req.query.sprintId) : undefined,
            userId: (req.params.userId || req.query.userId) ? String(req.params.userId || req.query.userId) : undefined,
            assignedTo: req.query.assignedTo ? String(req.query.assignedTo) : undefined,
            startDate: req.query.startDate ? String(req.query.startDate) : undefined,
            endDate: req.query.endDate ? String(req.query.endDate) : undefined,
        };
    }

	async getProjectReports(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = this.getFilters(req);
			const result = await this.getProjectReportsUseCase.execute(companyId, filters);

			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getSprintReports(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = this.getFilters(req);
			const result = await this.getSprintReportsUseCase.execute(companyId, filters);

			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getUserStoryReports(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = this.getFilters(req);
			const result = await this.getUserStoryReportsUseCase.execute(companyId, filters);

			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getSubtaskReports(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = this.getFilters(req);
			const result = await this.getSubtaskReportsUseCase.execute(companyId, filters);

			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}

	async getUserPerformanceReports(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const filters = this.getFilters(req);
			const result = await this.getUserPerformanceReportsUseCase.execute(companyId, filters);

			return res.status(SuccessStatus.OK).json({ success: true, ...result });
		} catch (error) {
			next(error);
		}
	}
}
