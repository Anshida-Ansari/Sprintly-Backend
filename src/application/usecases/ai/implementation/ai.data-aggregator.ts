import { inject, injectable } from "inversify";
import type { IAiDataAggregator, ProjectContext } from "../interface/ai.data-aggregator.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import type { IReportsRepository } from "@infrastructure/db/repository/interface/reports.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

@injectable()
export class AiDataAggregator implements IAiDataAggregator {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private readonly _subtaskRepository: ISubTaskRepository,
		@inject(STANDUP_TYPES.IStandupRepository)
		private readonly _standupRepository: IStandupRepository,
		@inject(REPORTS_TYPE.IReportsRepository)
		private readonly _reportsRepository: IReportsRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private readonly _projectRepository: IProjectReposiotory,
	) {}

	async getProjectContext(companyId: string, projectId?: string, userId?: string): Promise<ProjectContext> {
		// Fetch project info if projectId is available
		let projectInfo: ProjectContext["projectInfo"] | undefined;
		if (projectId) {
			const project = await this._projectRepository.findById(projectId);
			if (project) {
				projectInfo = {
					name: project.name,
					description: project.description,
					status: project.status,
				};
			}
		}

		// Fetch subtasks for the user/project
		const allSubtasks = userId 
			? await this._subtaskRepository.findByAssignedTo(userId)
			: await this._subtaskRepository.findByCompanyId(companyId);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		yesterday.setHours(0, 0, 0, 0);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const completedTasksYesterday = allSubtasks.filter(st => {
			if (!st.updatedAt) return false;
			const updatedAt = new Date(st.updatedAt);
			return st.status === SubTaskStatus.COMPLETED && 
				   updatedAt >= yesterday && 
				   updatedAt < today;
		});

		const inProgressTasksToday = allSubtasks.filter(st => {
			return st.status === SubTaskStatus.IN_PROGRESS;
		});

		// Blockers are tasks with status "Blocked" or high priority that are overdue
		// Assuming status might have "Blocked" even if not in enum, or check comments for "blocked"
		const blockedTasks = allSubtasks.filter(st => {
			const isBlockedStatus = (st.status as string).toLowerCase() === "blocked" || (st.status as string).toLowerCase() === "stuck";
			const hasBlockedComment = st.comments?.some(c => c.message.toLowerCase().includes("block"));
			return isBlockedStatus || hasBlockedComment;
		});

		const completedTasksCount = allSubtasks.filter(st => st.status === SubTaskStatus.COMPLETED).length;
		const pendingTasksCount = allSubtasks.filter(st => st.status === SubTaskStatus.PENDING).length;

		// Fetch recent activity from standups
		const recentStandups = projectId 
			? await this._standupRepository.findByProjectAndDate(projectId)
			: [];

		return {
			completedTasksYesterday,
			inProgressTasksToday,
			blockedTasks,
			totalTasksCount: allSubtasks.length,
			completedTasksCount,
			pendingTasksCount,
			blockedTasksCount: blockedTasks.length,
			recentActivity: recentStandups.slice(0, 5), // last 5 manual standup updates
			projectInfo,
		};
	}
}
