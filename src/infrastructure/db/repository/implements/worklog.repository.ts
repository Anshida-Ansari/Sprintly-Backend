import type { WorkLogEntity } from "@domain/entities/worklog.entity";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import type { WorkLogMapper } from "@infrastructure/mappers/worklog.mapper";
import { inject, injectable } from "inversify";
import mongoose, { type Model } from "mongoose";
import type { IWorkLogRepository } from "../interface/worklog.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class WorkLogRepository
	extends BaseRepository<WorkLogEntity>
	implements IWorkLogRepository
{
	constructor(
		@inject(WORKLOG_TYPE.WorkLogModel)
		model: Model<WorkLogEntity>,
		@inject(WORKLOG_TYPE.WorkLogMapper)
		private readonly _workLogMapper: WorkLogMapper,
	) {
		super(model);
	}

	async create(item: WorkLogEntity): Promise<WorkLogEntity> {
		const payload = this._workLogMapper.toMongo(item);
		const result = await this.model.create(payload);
		return this._workLogMapper.fromMongo(result);
	}

	async findById(id: string): Promise<WorkLogEntity | null> {
		const result = await this.model.findById(id);
		return result ? this._workLogMapper.fromMongo(result) : null;
	}

	async update(
		id: string,
		entity: WorkLogEntity,
	): Promise<WorkLogEntity | null> {
		const payload = this._workLogMapper.toMongo(entity);
		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
			runValidators: true,
		});
		return result ? this._workLogMapper.fromMongo(result) : null;
	}

	async findByUserId(
		userId: string,
		filters: Record<string, unknown> = {},
	): Promise<WorkLogEntity[]> {
		const query: Record<string, unknown> = {
			userId: new mongoose.Types.ObjectId(userId),
		};

		if (filters.startDate && filters.endDate) {
			query.date = {
				$gte: new Date(filters.startDate as string),
				$lte: new Date(filters.endDate as string),
			};
		}
		if (filters.projectId)
			query.projectId = new mongoose.Types.ObjectId(filters.projectId as string);
		if (filters.sprintId)
			query.sprintId = new mongoose.Types.ObjectId(filters.sprintId as string);

		const docs = await this.model.find(query).sort({ date: -1 });
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async findByProjectId(projectId: string): Promise<WorkLogEntity[]> {
		const docs = await this.model.find({
			projectId: new mongoose.Types.ObjectId(projectId),
		});
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async findBySprintId(sprintId: string): Promise<WorkLogEntity[]> {
		const docs = await this.model.find({
			sprintId: new mongoose.Types.ObjectId(sprintId),
		});
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async getWorkLogAnalytics(
		_companyId: string,
		filters: Record<string, unknown> = {},
	): Promise<unknown> {
		const matchQuery: mongoose.FilterQuery<WorkLogEntity> = {};

		if (filters.userId)
			matchQuery.userId = new mongoose.Types.ObjectId(filters.userId as string);
		if (filters.projectId)
			matchQuery.projectId = new mongoose.Types.ObjectId(
				filters.projectId as string,
			);
		if (filters.sprintId)
			matchQuery.sprintId = new mongoose.Types.ObjectId(
				filters.sprintId as string,
			);
		if (filters.startDate || filters.endDate) {
			matchQuery.date = {};
			if (filters.startDate)
				matchQuery.date.$gte = new Date(filters.startDate as string);
			if (filters.endDate)
				matchQuery.date.$lte = new Date(filters.endDate as string);
		}

		const logs = await this.model
			.find(matchQuery)
			.populate("userId", "name")
			.populate("projectId", "name")
			.populate("taskId", "title")
			.populate("subTaskId", "title")
			.sort({ date: -1 });

		const totalHoursResult = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: null, total: { $sum: "$hours" } } },
		]);
		const totalHours =
			totalHoursResult.length > 0 ? totalHoursResult[0].total : 0;

		const hoursPerUser = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: "$userId", totalHours: { $sum: "$hours" } } },
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{ $project: { userId: "$_id", userName: "$user.name", totalHours: 1 } },
		]);

		const hoursPerSprint = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: "$sprintId", totalHours: { $sum: "$hours" } } },
			{
				$lookup: {
					from: "sprints",
					localField: "_id",
					foreignField: "_id",
					as: "sprint",
				},
			},
			{ $unwind: "$sprint" },
			{
				$project: {
					sprintId: "$_id",
					sprintName: "$sprint.name",
					totalHours: 1,
				},
			},
		]);

		return {
			logs,
			totalHours: parseFloat(totalHours.toFixed(2)),
			hoursPerUser: hoursPerUser.map((u: Record<string, unknown>) => ({
				...u,
				totalHours: parseFloat((u.totalHours as number).toFixed(2)),
			})),
			hoursPerSprint: hoursPerSprint.map((s: Record<string, unknown>) => ({
				...s,
				totalHours: parseFloat((s.totalHours as number).toFixed(2)),
			})),
		};
	}
}
