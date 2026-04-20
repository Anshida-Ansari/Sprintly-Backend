export interface IReportFilter {
	page: number;
	limit: number;
	search?: string;
	status?: string;
	projectId?: string;
	sprintId?: string;
	assignedTo?: string;
	userId?: string;
	startDate?: string;
	endDate?: string;
}

export interface IReportResult<T = unknown> {
	data: T[];
	total: number;
}

export interface IReportsRepository {
	getProjectReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult>;
	getSprintReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult>;
	getUserStoryReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult>;
	getSubtaskReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult>;
	getUserPerformanceReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult>;
}
