import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { inject, injectable } from "inversify";
import mongoose, { type FilterQuery, type Model } from "mongoose";
import type {
	IReportFilter,
	IReportResult,
	IReportsRepository,
} from "../interface/reports.interface";

@injectable()
export class ReportsRepository implements IReportsRepository {
	constructor(
		@inject(PROJECT_TYPE.ProjectModel)
		private readonly projectModel: Model<unknown>,
		@inject(SPRINTS_TYPE.SprintModel)
		private readonly sprintModel: Model<unknown>,
		@inject(USERSTORY_TYPE.UserStoryModel)
		private readonly userStoryModel: Model<unknown>,
		@inject(SUBTASK_TYPE.SubTaskModel)
		private readonly subTaskModel: Model<unknown>,
		@inject(USER_TYPES.userModel) private readonly userModel: Model<unknown>,
	) {}

	async getProjectReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		const matchQuery: FilterQuery<unknown> = {
			companyId: new mongoose.Types.ObjectId(companyId),
		};
		if (filters.status) matchQuery.status = filters.status;
		if (filters.search)
			matchQuery.name = { $regex: filters.search, $options: "i" };
		if (filters.startDate || filters.endDate) {
			matchQuery.startDate = {};
			if (filters.startDate)
				matchQuery.startDate.$gte = new Date(filters.startDate);
			if (filters.endDate)
				matchQuery.startDate.$lte = new Date(filters.endDate);
		}

		const skip = (filters.page - 1) * filters.limit;

		const data = await this.projectModel.aggregate([
			{ $match: matchQuery },
			{
				$lookup: {
					from: "users",
					let: { leadId: "$leadId" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $ne: ["$$leadId", null] },
										{ $eq: ["$_id", { $toObjectId: "$$leadId" }] },
									],
								},
							},
						},
					],
					as: "leadInfo",
				},
			},
			{ $unwind: { path: "$leadInfo", preserveNullAndEmptyArrays: true } },
			{
				$project: {
					name: 1,
					status: 1,
					startDate: 1,
					endDate: 1,
					leadName: "$leadInfo.name",
					leadEmail: "$leadInfo.email",
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: filters.limit },
		]);

		const total = await this.projectModel.countDocuments(matchQuery);
		return { data, total };
	}

	async getSprintReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		const matchQuery: FilterQuery<unknown> = {
			companyId: new mongoose.Types.ObjectId(companyId),
		};
		if (filters.projectId)
			matchQuery.projectId = new mongoose.Types.ObjectId(filters.projectId);
		if (filters.status) matchQuery.status = filters.status;

		const skip = (filters.page - 1) * filters.limit;

		const data = await this.sprintModel.aggregate([
			{ $match: matchQuery },
			{
				$lookup: {
					from: "userstories",
					let: { sprintId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $ne: ["$sprintId", null] },
										{ $eq: [{ $toObjectId: "$sprintId" }, "$$sprintId"] },
									],
								},
							},
						},
					],
					as: "stories",
				},
			},
			{
				$project: {
					name: 1,
					startDate: 1,
					endDate: 1,
					status: 1,
					userStoriesCount: { $size: "$stories" },
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
														as: "story",
														cond: {
															$or: [
																{
																	$eq: ["$$story.status", UserStoryStatus.DONE],
																},
																{ $eq: ["$$story.status", "Done"] },
															],
														},
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
			{ $sort: { startDate: -1 } },
			{ $skip: skip },
			{ $limit: filters.limit },
		]);

		const total = await this.sprintModel.countDocuments(matchQuery);
		return { data, total };
	}

	async getUserStoryReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		const matchQuery: FilterQuery<unknown> = {
			companyId: new mongoose.Types.ObjectId(companyId),
		};
		if (filters.projectId)
			matchQuery.projectId = new mongoose.Types.ObjectId(filters.projectId);
		if (filters.sprintId)
			matchQuery.sprintId = new mongoose.Types.ObjectId(filters.sprintId);
		if (filters.status) matchQuery.status = filters.status;
		if (filters.assignedTo)
			matchQuery.assignedTo = new mongoose.Types.ObjectId(filters.assignedTo);

		const skip = (filters.page - 1) * filters.limit;

		const data = await this.userStoryModel.aggregate([
			{ $match: matchQuery },
			{
				$lookup: {
					from: "users",
					let: { assignedToIds: "$assignedTo" },
					pipeline: [
						{
							$match: {
								$expr: {
									$in: [
										"$_id",
										{
											$map: {
												input: { $ifNull: ["$$assignedToIds", []] },
												as: "id",
												in: { $toObjectId: "$$id" },
											},
										},
									],
								},
							},
						},
					],
					as: "usersInfo",
				},
			},
			{
				$project: {
					title: 1,
					status: 1,
					estimationPoints: 1,
					assignedUsers: "$usersInfo.name",
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: filters.limit },
		]);

		const total = await this.userStoryModel.countDocuments(matchQuery);
		return { data, total };
	}

	async getSubtaskReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		const matchQuery: Record<string, unknown> = {
			companyId: new mongoose.Types.ObjectId(companyId),
		};
		if (filters.assignedTo)
			matchQuery.assignedTo = new mongoose.Types.ObjectId(filters.assignedTo);
		if (filters.status) matchQuery.status = filters.status;

		const skip = (filters.page - 1) * filters.limit;

		const data = await this.subTaskModel.aggregate([
			{ $match: matchQuery },
			{
				$lookup: {
					from: "users",
					let: { assignedTo: "$assignedTo" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $ne: ["$$assignedTo", null] },
										{ $eq: ["$_id", { $toObjectId: "$$assignedTo" }] },
									],
								},
							},
						},
					],
					as: "userInfo",
				},
			},
			{ $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
			{
				$project: {
					title: 1,
					status: 1,
					estimatedHours: 1,
					actualHours: 1,
					assignedUserName: "$userInfo.name",
					attachmentsCount: { $size: { $ifNull: ["$attachments", []] } },
					commentsCount: { $size: { $ifNull: ["$comments", []] } },
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: filters.limit },
		]);

		const total = await this.subTaskModel.countDocuments(matchQuery);
		return { data, total };
	}

	async getUserPerformanceReports(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		const matchQuery: Record<string, unknown> = {
			companyId: new mongoose.Types.ObjectId(companyId),
			role: { $ne: "superadmin" },
		};
		if (filters.userId)
			matchQuery._id = new mongoose.Types.ObjectId(filters.userId);

		const skip = (filters.page - 1) * filters.limit;

		const data = await this.userModel.aggregate([
			{ $match: matchQuery },
			{
				$lookup: {
					from: "subtasks",
					let: { subtaskIds: "$worklogs.subTaskId" },
					pipeline: [
						{
							$match: {
								$expr: {
									$in: [
										"$_id",
										{
											$map: {
												input: { $ifNull: ["$$subtaskIds", []] },
												as: "id",
												in: { $toObjectId: "$$id" },
											},
										},
									],
								},
							},
						},
					],
					as: "matchedSubtasks",
				},
			},
			{
				$lookup: {
					from: "worklogs",
					let: { userId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $ne: ["$userId", null] },
										{ $eq: [{ $toObjectId: "$userId" }, "$$userId"] },
									],
								},
							},
						},
					],
					as: "worklogs",
				},
			},
			{
				$project: {
					name: 1,
					email: 1,
					tasksAssigned: { $size: { $ifNull: ["$matchedSubtasks", []] } },
					tasksCompleted: {
						$size: {
							$filter: {
								input: { $ifNull: ["$matchedSubtasks", []] },
								as: "task",
								cond: {
									$or: [
										{ $eq: ["$$task.status", SubTaskStatus.COMPLETED] },
										{ $eq: ["$$task.status", "Done"] },
										{ $eq: ["$$task.status", "completed"] },
										{ $eq: ["$$task.status", "COMPLETED"] },
									],
								},
							},
						},
					},
					totalHoursWorked: { $sum: "$worklogs.hours" },
					completionRate: {
						$cond: [
							{ $gt: [{ $size: { $ifNull: ["$matchedSubtasks", []] } }, 0] },
							{
								$multiply: [
									{
										$divide: [
											{
												$size: {
													$filter: {
														input: { $ifNull: ["$matchedSubtasks", []] },
														as: "task",
														cond: {
															$or: [
																{
																	$eq: [
																		"$$task.status",
																		SubTaskStatus.COMPLETED,
																	],
																},
																{ $eq: ["$$task.status", "Done"] },
																{ $eq: ["$$task.status", "completed"] },
																{ $eq: ["$$task.status", "COMPLETED"] },
															],
														},
													},
												},
											},
											{ $size: { $ifNull: ["$matchedSubtasks", []] } },
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
			{ $sort: { name: 1 } },
			{ $skip: skip },
			{ $limit: filters.limit },
		]);

		const total = await this.userModel.countDocuments(matchQuery);
		return { data, total };
	}
}
