import { inject, injectable } from "inversify";
import { SubTaskStatus } from "../../../../domain/enum/subtask/subtask.status";
import type { IMeetingRepository } from "../../../../infrastructure/db/repository/interface/meeting.interface";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { ISubTaskRepository } from "../../../../infrastructure/db/repository/interface/subtask.interface";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { SUBTASK_TYPE } from "../../../../infrastructure/di/types/subtask/subtask";
import type {
	IDeveloperDashboardStats,
	IGetDeveloperDashboardStatsUseCase,
} from "../interface/get.developer.dashboard.stats.interface";

@injectable()
export class GetDeveloperDashboardStatsUseCase
	implements IGetDeveloperDashboardStatsUseCase
{
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskRepository: ISubTaskRepository,
		@inject(MEETING_TYPES.IMeetingRepository)
		private _meetingRepository: IMeetingRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
	) {}

	async execute(
		userId: string,
		companyId: string,
	): Promise<IDeveloperDashboardStats> {
		const allAssignedSubTasks =
			await this._subtaskRepository.findByAssignedTo(userId);

		const userSubTasks = allAssignedSubTasks.filter(
			(t) => t.companyId.toString() === companyId.toString(),
		);

		let currentFocus = null;
		let inProgressTasks = userSubTasks.filter(
			(t) => t.status === SubTaskStatus.IN_PROGRESS,
		);

		if (inProgressTasks.length === 0) {
			inProgressTasks = userSubTasks.filter(
				(t) => t.status === SubTaskStatus.PENDING,
			);
		}

		if (inProgressTasks.length > 0) {
			const focusTask = inProgressTasks[0];
			currentFocus = {
				id: focusTask.id || "",
				title: focusTask.title,
				status: focusTask.status,
				description: "Currently assigned task in this sprint.",
				estimatedHours: focusTask.estimatedHours || 0,
				actualHours: focusTask.actualHours || 0,
			};
		}

		const upNextRaw = userSubTasks.filter(
			(t) => t.status === SubTaskStatus.PENDING && t.id !== currentFocus?.id,
		);
		const upNext = upNextRaw.slice(0, 5).map((t) => ({
			id: t.id || "",
			title: t.title,
			priority: "Normal",
			dueDate: "Today",
		}));

		const baseProjects = await this._projectRepository.find(
			{ companyId },
			{ skip: 0, limit: 1000 },
		);
		const projectIds = baseProjects.map((p) => p.id);
		const allMeetings = await this._meetingRepository.find(
			{ projectId: { $in: projectIds } },
			{ skip: 0, limit: 100 },
		);

		const today = new Date();
		const schedule = allMeetings
			.filter((m) => {
				const isParticipant =
					m.participants?.some(
						(p: any) => p.userId?.toString() === userId.toString(),
					) || m.createdBy.toString() === userId.toString();
				const mDate = new Date(m.date);
				const isToday =
					mDate.getDate() === today.getDate() &&
					mDate.getMonth() === today.getMonth() &&
					mDate.getFullYear() === today.getFullYear();
				return isParticipant && isToday;
			})
			.map((m) => ({
				id: m.id || "",
				title: m.title,
				date: m.date,
				roomId: m.roomId,
				status: m.status,
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		const completedTasks = userSubTasks.filter(
			(t) => t.status === SubTaskStatus.COMPLETED,
		).length;
		const totalTasks = userSubTasks.length || 1;

		const loggedHours = userSubTasks.reduce(
			(acc, curr) => acc + (curr.actualHours || 0),
			0,
		);
		const totalHours =
			userSubTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) ||
			1;

		return {
			currentFocus,
			upNext,
			schedule,
			dailyTargets: {
				completedTasks,
				totalTasks,
				loggedHours,
				totalHours,
			},
		};
	}
}
