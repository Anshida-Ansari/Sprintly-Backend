import type { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export interface ProjectContext {
	completedTasksYesterday: any[];
	inProgressTasksToday: any[];
	blockedTasks: any[];
	totalTasksCount: number;
	completedTasksCount: number;
	pendingTasksCount: number;
	blockedTasksCount: number;
	recentActivity: any[];
	projectInfo?: {
		name: string;
		description: string;
		status: string;
	};
}

export interface IAiDataAggregator {
	getProjectContext(companyId: string, projectId?: string, userId?: string): Promise<ProjectContext>;
}
