import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { ITopMember } from "../../../../infrastructure/db/repository/interface/subtask.interface";

export interface IDashboardStats {
	totalProjects: number;
	totalUsers: number;
	totalSprints: number;
	totalUserStories: number;
	totalSubTasks: number;
	subTasksByStatus: {
		pending: number;
		inProgress: number;
		completed: number;
	};
	userStoriesByStatus: {
		pending: number;
		inProgress: number;
		done: number;
	};
	activeProjects: number;
	runningSprints: number;
	completedSprints: number;
	pendingReviews: number;
	totalMeetings: number;
	topMembers: ITopMember[];
	liveActivity: SubTaskEntity[];
	activeSprint: {
		id: string;
		name: string;
		totalTasks: number;
		completedTasks: number;
		endDate: Date;
	} | null;
	// Subscription Info
	companyPlan: string;
	projectLimit: number;
	subscriptionEndDate: Date | null;
	autoRenew: boolean;
}

export interface IGetDashboardStatsUseCase {
	execute(companyId: string): Promise<IDashboardStats>;
}
