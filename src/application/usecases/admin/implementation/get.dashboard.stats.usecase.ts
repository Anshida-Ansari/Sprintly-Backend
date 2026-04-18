import { inject, injectable } from "inversify";
import { ProjectStatus } from "../../../../domain/enum/project/project.status";
import { SubTaskStatus } from "../../../../domain/enum/subtask/subtask.status";
import { UserStoryStatus } from "../../../../domain/enum/userstory/user.story.status";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { IMeetingRepository } from "../../../../infrastructure/db/repository/interface/meeting.interface";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { ISprintReposiotry } from "../../../../infrastructure/db/repository/interface/sprints.interface";
import type { ISubTaskRepository } from "../../../../infrastructure/db/repository/interface/subtask.interface";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import type { IUserStroyRepository } from "../../../../infrastructure/db/repository/interface/user.story.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "../../../../infrastructure/di/types/spirnts/sprints.types";
import { SUBTASK_TYPE } from "../../../../infrastructure/di/types/subtask/subtask";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { USERSTORY_TYPE } from "../../../../infrastructure/di/types/userstory/userstory";
import type {
	IDashboardStats,
	IGetDashboardStatsUseCase,
} from "../interface/get.dashboard.stats.interface";

@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
		@inject(SPRINTS_TYPE.ISprintReposiotry)
		private _sprintRepository: ISprintReposiotry,
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userStoryRepository: IUserStroyRepository,
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskRepository: ISubTaskRepository,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
		@inject(MEETING_TYPES.IMeetingRepository)
		private _meetingRepository: IMeetingRepository,
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute(companyId: string): Promise<IDashboardStats> {
		const [
			totalProjects,
			totalUsers,
			totalSprints,
			totalUserStories,
			totalSubTasks,
			subTasksPending,
			subTasksInProgress,
			subTasksCompleted,
			userStoriesPending,
			userStoriesInProgress,
			userStoriesDone,
			activeProjects,
			runningSprints,
			completedSprints,
			pendingReviews,
			topMembers,
			liveActivity,
		] = await Promise.all([
			this._projectRepository.count({ companyId }),
			this._userRepository.count({ companyId }),
			this._sprintRepository.count({ companyId }),
			this._userStoryRepository.count({ companyId }),
			this._subtaskRepository.count({ companyId }),
			this._subtaskRepository.count({
				companyId,
				status: SubTaskStatus.PENDING,
			}),
			this._subtaskRepository.count({
				companyId,
				status: SubTaskStatus.IN_PROGRESS,
			}),
			this._subtaskRepository.count({
				companyId,
				status: SubTaskStatus.COMPLETED,
			}),
			this._userStoryRepository.count({
				companyId,
				status: UserStoryStatus.IN_PENDING,
			}),
			this._userStoryRepository.count({
				companyId,
				status: UserStoryStatus.IN_PROGRESS,
			}),
			this._userStoryRepository.count({
				companyId,
				status: UserStoryStatus.DONE,
			}),
			this._projectRepository.count({
				companyId,
				status: ProjectStatus.ACTIVE,
			}),
			this._sprintRepository.count({ companyId, status: "ACTIVE" }),
			this._sprintRepository.count({ companyId, status: "COMPLETED" }),
			this._userStoryRepository.count({
				companyId,
				status: UserStoryStatus.IN_REVIEW,
			}),
			this._subtaskRepository.getTopMembers(companyId, 5),
			this._subtaskRepository.getLiveActivity(companyId, 10),
		]);

		const baseProjects = await this._projectRepository.find(
			{ companyId },
			{ skip: 0, limit: 1000 },
		);
		const projectIds = baseProjects.map((p) => p.id);
		const totalMeetings = await this._meetingRepository.count({
			projectId: { $in: projectIds },
		});

		// Fetch company subscription details
		const company = await this._companyRepository.findByCompanyId(companyId);

		// Fetch one active sprint for the snapshot
		const activeSprints = await this._sprintRepository.find(
			{ companyId, status: "ACTIVE" },
			{ skip: 0, limit: 1 }
		);
		let activeSprintData: any = null;

		if (activeSprints && activeSprints.length > 0) {
			const sprint = activeSprints[0];
			// For the snapshot, we want total tasks and completed tasks in THIS sprint
			// We need to fetch all user stories in this sprint
			const sprintStories = await this._userStoryRepository.find(
				{ sprintId: (sprint as any).id || (sprint as any)._id },
				{ skip: 0, limit: 1000 }
			);
			const storyIds = sprintStories.map(s => s.id).filter((id): id is string => !!id);
			
			const sprintTasks = await this._subtaskRepository.findByUserStoryIds(storyIds);
			const completedSprintTasks = sprintTasks.filter(t => t.status === SubTaskStatus.COMPLETED);

			activeSprintData = {
				id: sprint.id,
				name: sprint.name,
				totalTasks: sprintTasks.length,
				completedTasks: completedSprintTasks.length,
				endDate: sprint.endDate,
			};
		}

		return {
			totalProjects,
			totalUsers,
			totalSprints,
			totalUserStories,
			totalSubTasks,
			subTasksByStatus: {
				pending: subTasksPending,
				inProgress: subTasksInProgress,
				completed: subTasksCompleted,
			},
			userStoriesByStatus: {
				pending: userStoriesPending,
				inProgress: userStoriesInProgress,
				done: userStoriesDone,
			},
			activeProjects,
			runningSprints,
			completedSprints,
			pendingReviews,
			totalMeetings,
			topMembers,
			liveActivity,
			activeSprint: activeSprintData,
			// Subscription Info
			companyPlan: company?.currentPlan ?? "free",
			projectLimit: company?.projectLimit ?? 2,
			subscriptionEndDate: company?.subscriptionEndDate ?? null,
			autoRenew: company?.autoRenew ?? true,
		};
	}
}
