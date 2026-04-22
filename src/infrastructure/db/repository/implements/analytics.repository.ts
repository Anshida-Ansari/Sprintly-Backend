import { SubTaskStatus } from "@domain/enum/subtask/subtask.status.js";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status.js";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types.js";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask.js";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types.js";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory.js";
import { inject, injectable } from "inversify";
import mongoose, { type Document, type Model } from "mongoose";
import type { IAnalyticsRepository } from "../interface/analytics.interface.js";

interface ISprint extends Document {
	startDate: Date;
	endDate: Date;
}

interface IUserStory extends Document {
	estimationPoints: number;
	status: UserStoryStatus;
	completedAt?: Date;
	updatedAt: Date;
	assignedTo?: mongoose.Types.ObjectId[];
}

interface ISubTask extends Document {
	estimatedHours: number;
	status: SubTaskStatus;
	completedAt?: Date;
	updatedAt: Date;
}

@injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
	constructor(
		@inject(SPRINTS_TYPE.SprintModel)
		private readonly sprintModel: Model<ISprint>,
		@inject(SUBTASK_TYPE.SubTaskModel)
		private readonly subTaskModel: Model<ISubTask>,
		@inject(USERSTORY_TYPE.UserStoryModel)
		private readonly userStoryModel: Model<IUserStory>,
		@inject(USER_TYPES.userModel)
		private readonly userModel: Model<unknown>,
	) {}

	async getSprintBurndown(
		sprintId: string,
		type: "hours" | "points" = "hours",
	): Promise<Record<string, unknown>> {
		const sprint = await this.sprintModel.findById(sprintId);
		if (!sprint) throw new Error("Sprint not found");

		const userStories = await this.userStoryModel.find({
			sprintId: new mongoose.Types.ObjectId(sprintId),
		});
		const userStoryIds = userStories.map((us) => us._id);

		let totalWork = 0;
		let completedData: Array<{ burned: number; date: string }> = [];

		if (type === "hours") {
			const subTasks = (await this.subTaskModel.find({
				userStoryId: { $in: userStoryIds },
			})) as Array<Record<string, unknown>>;
			totalWork = subTasks.reduce(
				(sum, task) => sum + ((task.estimatedHours as number) || 0),
				0,
			);
			completedData = subTasks
				.filter(
					(task) =>
						task.status === SubTaskStatus.COMPLETED &&
						(task.completedAt || task.updatedAt),
				)
				.map((task) => ({
					burned: (task.estimatedHours as number) || 0,
					date: ((task.completedAt as Date) || (task.updatedAt as Date))
						.toISOString()
						.split("T")[0],
				}));
		} else {
			totalWork = userStories.reduce(
				(sum, us) => sum + (us.estimationPoints || 0),
				0,
			);
			completedData = userStories
				.filter(
					(us) =>
						us.status === UserStoryStatus.DONE &&
						(us.completedAt || us.updatedAt),
				)
				.map((us) => ({
					burned: us.estimationPoints || 0,
					date: (us.completedAt || us.updatedAt)
						?.toISOString()
						.split("T")[0],
				}));
		}

		return this.calculateBurndown(
			sprint.startDate,
			sprint.endDate,
			totalWork,
			completedData,
		);
	}

	async getUserBurndown(
		sprintId: string,
		userId: string,
		type: "hours" | "points" = "hours",
	): Promise<Record<string, unknown>> {
		const sprint = await this.sprintModel.findById(sprintId);
		if (!sprint) throw new Error("Sprint not found");

		const userStories = await this.userStoryModel.find({
			sprintId: new mongoose.Types.ObjectId(sprintId),
		});
		const userStoryIds = userStories.map((us) => us._id);

		let totalWork = 0;
		let completedData: Array<{ burned: number; date: string }> = [];

		if (type === "hours") {
			const subTasks = (await this.subTaskModel.find({
				userStoryId: { $in: userStoryIds },
				assignedTo: new mongoose.Types.ObjectId(userId),
			})) as Array<Record<string, unknown>>;
			totalWork = subTasks.reduce(
				(sum, task) => sum + ((task.estimatedHours as number) || 0),
				0,
			);
			completedData = subTasks
				.filter(
					(task) =>
						task.status === SubTaskStatus.COMPLETED &&
						(task.completedAt || task.updatedAt),
				)
				.map((task) => ({
					burned: (task.estimatedHours as number) || 0,
					date: ((task.completedAt as Date) || (task.updatedAt as Date))
						.toISOString()
						.split("T")[0],
				}));
		} else {
			const userStoriesAssigned = userStories.filter((us) =>
				us.assignedTo?.some((id) => id.toString() === userId),
			);
			totalWork = userStoriesAssigned.reduce(
				(sum, us) => sum + (us.estimationPoints || 0),
				0,
			);
			completedData = userStoriesAssigned.filter(
				(us) =>
						us.status === UserStoryStatus.DONE &&
						(us.completedAt || us.updatedAt),
				)
				.map((us) => ({
					burned: us.estimationPoints || 0,
					date: (us.completedAt || us.updatedAt)
						?.toISOString()
						.split("T")[0],
				}));
		}

		return this.calculateBurndown(
			sprint.startDate,
			sprint.endDate,
			totalWork,
			completedData,
		);
	}

	async getDashboardAnalytics(
		companyId: string,
		filters: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		const companyObjectId = new mongoose.Types.ObjectId(companyId.toString());
		const userStoryMatchQuery: Record<string, unknown> = {
			companyId: companyObjectId,
		};
		const subtaskMatchQuery: Record<string, unknown> = {
			companyId: companyObjectId,
		};

		if (
			filters.projectId &&
			filters.projectId !== "undefined" &&
			filters.projectId !== ""
		) {
			const projectObjectId = new mongoose.Types.ObjectId(
				filters.projectId.toString(),
			);
			userStoryMatchQuery.projectId = projectObjectId;

			// For subtasks, we need to match via userStoryId since they don't have projectId
			const stories = await this.userStoryModel
				.find({
					projectId: projectObjectId,
					companyId: companyObjectId,
				})
				.select("_id");
			const usIds = stories.map((s) => s._id);
			subtaskMatchQuery.userStoryId = { $in: usIds };
		}

		const doneStatuses = [
			"Done",
			"done",
			"completed",
			"COMPLETED",
			"Completed",
		];

		// 1. Task Distribution (Status Pie)
		const taskDistribution = await this.subTaskModel.aggregate([
			{
				$match: {
					...subtaskMatchQuery,
					companyId: companyObjectId,
				},
			},
			{ $group: { _id: "$status", count: { $sum: 1 } } },
		]);

		// 2. User Productivity (Bar Charts)
		const userProductivity = await this.userModel.aggregate([
			{
				$match: {
					companyId: companyObjectId,
					role: { $ne: "superadmin" },
				},
			},
			{
				$lookup: {
					from: "worklogs",
					localField: "_id",
					foreignField: "userId",
					as: "logs",
				},
			},
			{
				$project: {
					name: 1,
					totalHours: { $sum: "$logs.hours" },
					taskIds: "$logs.subTaskId",
				},
			},
			{
				$lookup: {
					from: "subtasks",
					let: { subtaskIds: "$taskIds" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $in: ["$_id", { $ifNull: ["$$subtaskIds", []] }] },
										{ $in: ["$status", doneStatuses] },
										...(subtaskMatchQuery.userStoryId
											? [
													{
														$in: [
															"$userStoryId",
															(subtaskMatchQuery.userStoryId as { $in: mongoose.Types.ObjectId[] }).$in,
														],
													},
												]
											: []),
									],
								},
							},
						},
					],
					as: "completedSubtasks",
				},
			},
			{
				$project: {
					name: 1,
					totalHours: 1,
					completedTasks: { $size: "$completedSubtasks" },
					efficiency: {
						$cond: [
							{ $gt: ["$totalHours", 0] },
							{ $divide: [{ $size: "$completedSubtasks" }, "$totalHours"] },
							0,
						],
					},
				},
			},
			{ $sort: { completedTasks: -1 } },
		]);

		// 3. Project Health & Overall Trends
		const projectHealth = await this.userStoryModel.aggregate([
			{ $match: userStoryMatchQuery },
			{
				$group: {
					_id: null,
					totalStories: { $sum: 1 },
					completedStories: {
						$sum: {
							$cond: [{ $in: ["$status", doneStatuses] }, 1, 0],
						},
					},
					totalEstimation: { $sum: "$estimationPoints" },
				},
			},
		]);

		// 4. Overdue Tasks
		const today = new Date();
		const overdueAggregation = await this.subTaskModel.aggregate([
			{
				$match: {
					...subtaskMatchQuery,
					status: { $nin: doneStatuses },
				},
			},
			{
				$lookup: {
					from: "userstories",
					localField: "userStoryId",
					foreignField: "_id",
					as: "story",
				},
			},
			{ $unwind: { path: "$story", preserveNullAndEmptyArrays: false } },
			{
				$lookup: {
					from: "sprints",
					localField: "story.sprintId",
					foreignField: "_id",
					as: "sprint",
				},
			},
			{ $unwind: { path: "$sprint", preserveNullAndEmptyArrays: false } },
			{
				$match: {
					"sprint.endDate": { $lt: today },
				},
			},
			{ $count: "count" },
		]);

		// 4. Tasks Over Time (Last 30 days trend)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const tasksOverTime = await this.subTaskModel.aggregate([
			{
				$match: {
					...subtaskMatchQuery,
					status: { $in: doneStatuses },
					updatedAt: { $gte: thirtyDaysAgo },
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
					completedTasks: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{
				$project: {
					date: "$_id",
					completedTasks: 1,
					_id: 0,
				},
			},
		]);

		// 5. Sprint Analytics (Completion per sprint)
		let sprintAnalytics = [];
		if (filters.projectId) {
			const projectObjectId = new mongoose.Types.ObjectId(
				filters.projectId.toString(),
			);
			sprintAnalytics = await this.sprintModel.aggregate([
				{ $match: { projectId: projectObjectId, companyId: companyObjectId } },
				{
					$lookup: {
						from: "userstories",
						localField: "_id",
						foreignField: "sprintId",
						as: "stories",
					},
				},
				{
					$project: {
						name: 1,
						completionRate: {
							$cond: [
								{ $gt: [{ $size: "$stories" }, 0] },
								{
									$multiply: [
										{
											$divide: [
												{
													$size: {
														$filter: {
															input: "$stories",
															as: "s",
															cond: { $in: ["$$s.status", doneStatuses] },
														},
													},
												},
												{ $size: "$stories" },
											],
										},
										100,
									],
								},
								0,
							],
						},
					},
				},
				{ $limit: 10 },
			]);
		}

		// 6. Story Completion Trend
		const storyCompletionTrend = await this.userStoryModel.aggregate([
			{
				$match: {
					...userStoryMatchQuery,
					status: { $in: doneStatuses },
					updatedAt: { $gte: thirtyDaysAgo },
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
					completedStories: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{
				$project: {
					date: "$_id",
					completedStories: 1,
					_id: 0,
				},
			},
		]);

		return {
			taskDistribution,
			tasksOverTime,
			userProductivity,
			sprintAnalytics,
			storyCompletionTrend,
			overallHealth: projectHealth[0] || {
				totalStories: 0,
				completedStories: 0,
				totalEstimation: 0,
			},
			overdueCount: overdueAggregation[0]?.count || 0,
		};
	}

	private calculateBurndown(
		startDate: Date | string,
		endDate: Date | string,
		totalWork: number,
		completedData: { burned: number; date: string }[],
	): Record<string, unknown> {
		const labels = [];
		const ideal = [];
		const actual = [];

		if (!startDate || !endDate) {
			return { labels: [], ideal: [], actual: [] };
		}

		// Normalize dates to start of day UTC for consistent comparison
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
			return { labels: [], ideal: [], actual: [] };
		}

		start.setUTCHours(0, 0, 0, 0);
		end.setUTCHours(0, 0, 0, 0);

		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		const diffTime = end.getTime() - start.getTime();
		const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

		const completedMap = new Map<string, number>();
		for (const item of completedData) {
			completedMap.set(
				item.date,
				(completedMap.get(item.date) || 0) + item.burned,
			);
		}

		let currentActualRemaining = totalWork;
		const currentDate = new Date(start);
		let dayIndex = 0;

		// Limit loop to prevent infinite runs if dates are somehow broken
		const maxDays = 100;

		while (currentDate <= end && dayIndex < maxDays) {
			const dateStr = currentDate.toISOString().split("T")[0];
			labels.push(`Day ${dayIndex + 1}`);

			// Ideal line calculation: linear decrease from totalWork to 0
			const idealVal = totalWork - (dayIndex / totalDays) * totalWork;
			ideal.push(parseFloat(Math.max(0, idealVal).toFixed(2)));

			// Actual line calculation: only up to today
			if (currentDate <= today) {
				const burnedToday = completedMap.get(dateStr) || 0;
				currentActualRemaining -= burnedToday;
				actual.push(parseFloat(Math.max(0, currentActualRemaining).toFixed(2)));
			}

			currentDate.setUTCDate(currentDate.getUTCDate() + 1);
			dayIndex++;
		}

		// Final check - ensure ideal reaches 0 if it's the last day
		if (ideal.length > 0 && dayIndex >= totalDays) {
			ideal[ideal.length - 1] = 0;
		}

		return { labels, ideal, actual };
	}
}
