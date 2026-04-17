export interface IReportsRepository {
	getProjectReports(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
	getSprintReports(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
	getUserStoryReports(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
	getSubtaskReports(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
	getUserPerformanceReports(companyId: string, filters: any): Promise<{ data: any[]; total: number }>;
}
