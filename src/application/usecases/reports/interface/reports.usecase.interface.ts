import type { IReportFilter, IReportResult } from "@infrastructure/db/repository/interface/reports.interface";

export interface IGetProjectReportsUseCase {
	execute(companyId: string, filters: IReportFilter): Promise<IReportResult>;
}

export interface IGetSprintReportsUseCase {
	execute(companyId: string, filters: IReportFilter): Promise<IReportResult>;
}

export interface IGetUserStoryReportsUseCase {
	execute(companyId: string, filters: IReportFilter): Promise<IReportResult>;
}

export interface IGetSubtaskReportsUseCase {
	execute(companyId: string, filters: IReportFilter): Promise<IReportResult>;
}

export interface IGetUserPerformanceReportsUseCase {
	execute(companyId: string, filters: IReportFilter): Promise<IReportResult>;
}
