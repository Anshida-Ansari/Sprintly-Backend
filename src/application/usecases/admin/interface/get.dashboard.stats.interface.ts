export interface IDashboardStats {
	totalProjects: number;
	totalUsers: number;
	totalSprints: number;
	totalSubTasks: number;
	subTasksByStatus: {
		pending: number;
		inProgress: number;
		completed: number;
	};
	activeProjects: number;
	runningSprints: number;
	completedSprints: number;
	pendingReviews: number;
	totalMeetings: number;
	topMembers: any[];
	liveActivity: any[];
}

export interface IGetDashboardStatsUseCase {
	execute(companyId: string): Promise<IDashboardStats>;
}
