export interface IDashboardStats {
	activeProjects: number;
	runningSprints: number;
	pendingReviews: number;
}

export interface IGetDashboardStatsUseCase {
	execute(companyId: string): Promise<IDashboardStats>;
}
