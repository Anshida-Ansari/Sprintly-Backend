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
	// Subscription Info
	companyPlan: string;
	projectLimit: number;
	subscriptionEndDate: Date | null;
	autoRenew: boolean;
}

export interface IGetDashboardStatsUseCase {
	execute(companyId: string): Promise<IDashboardStats>;
}
