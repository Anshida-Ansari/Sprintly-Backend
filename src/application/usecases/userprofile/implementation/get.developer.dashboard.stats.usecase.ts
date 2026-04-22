import { inject, injectable } from "inversify";
import { SubTaskStatus } from "../../../../domain/enum/subtask/subtask.status";
import type { IMeetingRepository } from "../../../../infrastructure/db/repository/interface/meeting.interface";
import type { IProjectRepository } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { ISprintRepository } from "../../../../infrastructure/db/repository/interface/sprints.interface";
import type { ISubTaskRepository } from "../../../../infrastructure/db/repository/interface/subtask.interface";
import type { IUserStoryRepository } from "../../../../infrastructure/db/repository/interface/user.story.interface";
import type { IWorkLogRepository } from "../../../../infrastructure/db/repository/interface/worklog.interface";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "../../../../infrastructure/di/types/sprints/sprints.types";
import { SUBTASK_TYPE } from "../../../../infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "../../../../infrastructure/di/types/userstory/userstory";
import { WORKLOG_TYPE } from "../../../../infrastructure/di/types/worklog/worklog";
import type { SubTaskEntity } from "../../../../domain/entities/subtask.entity";
import type {
	IDashboardEnrichedTask,
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
		private _projectRepository: IProjectRepository,
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintRepository: ISprintRepository,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userStoryRepository: IUserStoryRepository,
		@inject(WORKLOG_TYPE.IWorkLogRepository)
		private _worklogRepository: IWorkLogRepository,
	) {}

	async execute(
		userId: string,
		companyId: string,
	): Promise<IDeveloperDashboardStats> {
		// 1. Fetch all subtasks assigned to the developer in the current company
		const allAssignedSubTasks =
			await this._subtaskRepository.findByAssignedTo(userId);
		const userSubTasks = allAssignedSubTasks.filter(
			(t) => t.companyId.toString() === companyId.toString(),
		);

		// 2. Enrich subtasks with metadata (Project & Sprint names)
		const userStoryIds = [
			...new Set(userSubTasks.map((t) => t.userStoryId.toString())),
		];
		const userStories = await this._userStoryRepository.find(
			{ _id: { $in: userStoryIds } },
			{ skip: 0, limit: 1000 },
		);

		const projectIds = [
			...new Set(userStories.map((s) => s.projectId.toString())),
		];
		const sprintIds = [
			...new Set(
				userStories
					.filter((s) => s.sprintId)
					.map((s) => s.sprintId?.toString() as string),
			),
		];

		const [projects, sprints] = await Promise.all([
			this._projectRepository.find(
				{ _id: { $in: projectIds } },
				{ skip: 0, limit: 1000 },
			),
			this._sprintRepository.find(
				{ _id: { $in: sprintIds } },
				{ skip: 0, limit: 1000 },
			),
		]);

		const projectMap = new Map(projects.map((p) => [p.id, p]));
		const sprintMap = new Map(sprints.map((s) => [s.id, s]));
		const storyMap = new Map(userStories.map((s) => [s.id, s]));

		// Helper to enrich a task
		const enrichTask = (task: SubTaskEntity): IDashboardEnrichedTask => {
			const story = storyMap.get(task.userStoryId.toString());
			const project = story ? projectMap.get(story.projectId.toString()) : null;
			const sprint = story?.sprintId
				? sprintMap.get(story.sprintId.toString())
				: null;
			return {
				...task.toJSON(),
				projectName: project?.name || "Unknown Project",
				sprintName: sprint?.name || "No Sprint",
				dueDate: sprint?.endDate || null,
			};
		};

		// 3. Categorize Tasks
		const pendingTasks = userSubTasks
			.filter((t) => t.status === SubTaskStatus.PENDING)
			.map(enrichTask);
		const inProgressTasks = userSubTasks
			.filter((t) => t.status === SubTaskStatus.IN_PROGRESS)
			.map(enrichTask);
		const completedTasks = userSubTasks
			.filter((t) => t.status === SubTaskStatus.COMPLETED)
			.map(enrichTask);

		const enrichedUserSubTasks = [
			...pendingTasks,
			...inProgressTasks,
			...completedTasks,
		];

		// 4. Determine Current Focus
		let currentFocus = null;
		if (inProgressTasks.length > 0) {
			const focusTask = inProgressTasks[0];
			currentFocus = {
				id: focusTask.id || "",
				title: focusTask.title,
				status: focusTask.status,
				projectName: focusTask.projectName,
				sprintName: focusTask.sprintName,
				estimatedHours: focusTask.estimatedHours || 0,
				actualHours: focusTask.actualHours || 0,
				dueDate: focusTask.dueDate,
			};
		}

		// 5. Aggregate "Today's Work"
		const now = new Date();
		const todayTasks = enrichedUserSubTasks
			.filter((t) => {
				if (t.status === SubTaskStatus.COMPLETED) return false;
				if (!t.dueDate) return t.status === SubTaskStatus.IN_PROGRESS;
				const dueDate = new Date(t.dueDate);
				return dueDate <= now || t.status === SubTaskStatus.IN_PROGRESS;
			})
			.map((t) => ({
				id: t.id || "",
				title: t.title,
				projectName: t.projectName,
				status: t.status,
				priority: "Normal", // Subtasks don't have priority directly, using default
				dueDate: t.dueDate,
				isOverdue: t.dueDate
					? new Date(t.dueDate) < now && t.status !== SubTaskStatus.COMPLETED
					: false,
			}))
			.sort((a, b) => (a.isOverdue === b.isOverdue ? 0 : a.isOverdue ? -1 : 1));

		// 6. Active Sprint Info
		const activeSprints = await this._sprintRepository.find(
			{ companyId, status: "ACTIVE" },
			{ skip: 0, limit: 1 },
		);
		let activeSprintInfo = null;
		if (activeSprints.length > 0) {
			const sprint = activeSprints[0];
			const sprintId = sprint.id;

			// Tasks assigned to user in THIS sprint
			const sprintTasks = enrichedUserSubTasks.filter((t) => {
				const story = storyMap.get(t.userStoryId.toString());
				return story?.sprintId?.toString() === sprintId?.toString();
			});

			const sprintCompleted = sprintTasks.filter(
				(t) => t.status === SubTaskStatus.COMPLETED,
			).length;
			const totalInSprint = sprintTasks.length;
			const daysLeft = Math.ceil(
				(new Date(sprint.endDate).getTime() - now.getTime()) /
					(1000 * 60 * 60 * 24),
			);

			activeSprintInfo = {
				id: sprintId || "",
				name: sprint.name,
				daysLeft: Math.max(0, daysLeft),
				totalTasks: totalInSprint,
				completedTasks: sprintCompleted,
				completionPercentage:
					totalInSprint > 0
						? Math.round((sprintCompleted / totalInSprint) * 100)
						: 0,
			};
		}

		// 7. Performance Stats (Weekly)
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		const completedThisWeek = completedTasks.filter(
			(t) => t.completedAt && new Date(t.completedAt) >= startOfWeek,
		).length;

		const worklogs = await this._worklogRepository.findByUserId(userId, {
			createdAt: { $gte: startOfWeek },
		});
		const hoursWorkedThisWeek = worklogs.reduce(
			(acc, curr) => acc + (curr.hours || 0),
			0,
		);

		// 8. Recent Activity
		// Simulate activity by gathering recent status updates and comments
		const recentComments = userSubTasks.flatMap((t) =>
			(t.comments || [])
				.filter((c) => c.userId?.toString() === userId.toString())
				.map((c) => ({
					id: `${t.id}-comment-${c.createdAt.getTime()}`,
					type: "COMMENT_ADDED" as const,
					title: `Commented on ${t.title}`,
					message: c.message,
					timestamp: c.createdAt,
				})),
		);

		const recentUpdates = userSubTasks
			.filter((t) => t.updatedAt && new Date(t.updatedAt) >= startOfWeek)
			.map((t) => ({
				id: `${t.id}-update-${t.updatedAt?.getTime()}`,
				type: "TASK_UPDATE" as const,
				title: `Updated ${t.title}`,
				message: `Status: ${t.status}`,
				timestamp: t.updatedAt as Date,
			}));

		const recentActivity = [...recentComments, ...recentUpdates]
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.slice(0, 10);

		// 9. Schedule (Today's Meetings)
		const allMeetings = await this._meetingRepository.find(
			{ projectId: { $in: projectIds } },
			{ skip: 0, limit: 100 },
		);

		const schedule = allMeetings
			.filter((m) => {
				const isParticipant =
					m.participants?.some(
						(p: { userId: string }) =>
							p.userId?.toString() === userId.toString(),
					) || m.createdBy.toString() === userId.toString();
				const mDate = new Date(m.date);
				const isToday =
					mDate.getDate() === now.getDate() &&
					mDate.getMonth() === now.getMonth() &&
					mDate.getFullYear() === now.getFullYear();
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

		return {
			currentFocus,
			todayTasks,
			myTasks: {
				pending: pendingTasks,
				inProgress: inProgressTasks,
				completed: completedTasks,
			},
			activeSprint: activeSprintInfo,
			performance: {
				tasksCompletedThisWeek: completedThisWeek,
				hoursWorkedThisWeek,
				completionRate:
					enrichedUserSubTasks.length > 0
						? Math.round(
								(completedTasks.length / enrichedUserSubTasks.length) * 100,
							)
						: 0,
			},
			recentActivity,
			schedule,
		};
	}
}
