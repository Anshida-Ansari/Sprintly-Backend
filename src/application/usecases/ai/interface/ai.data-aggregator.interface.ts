import type { StandupEntity } from "@domain/entities/standup.entity";
import type { SubTaskEntity } from "@domain/entities/subtask.entity";

export interface ProjectContext {
	completedTasksYesterday: SubTaskEntity[];
	inProgressTasksToday: SubTaskEntity[];
	blockedTasks: SubTaskEntity[];
	totalTasksCount: number;
	completedTasksCount: number;
	pendingTasksCount: number;
	blockedTasksCount: number;
	recentActivity: StandupEntity[];
	projectInfo?: {
		name: string;
		description: string;
		status: string;
	};
	companyProjects: {
		id: string;
		name: string;
		status: string;
	}[];
	totalProjectsCount: number;
}

export interface IAiDataAggregator {
	getProjectContext(
		companyId: string,
		projectId?: string,
		userId?: string,
	): Promise<ProjectContext>;
}
