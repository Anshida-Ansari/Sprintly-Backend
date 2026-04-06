import type { WorkLogEntity } from "@domain/entities/worklog.entity";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { WorkLogMapper } from "@infrastructure/mappers/worklog.mapper";
import { inject, injectable } from "inversify";
import mongoose, { type Model } from "mongoose";
import type { IWorkLogRepository } from "../interface/worklog.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class WorkLogRepository extends BaseRepository<WorkLogEntity> implements IWorkLogRepository {
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

	async update(id: string, entity: WorkLogEntity): Promise<WorkLogEntity | null> {
		const payload = this._workLogMapper.toMongo(entity);
		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
			runValidators: true,
		});
		return result ? this._workLogMapper.fromMongo(result) : null;
	}

	async findByUserId(userId: string, filters: any = {}): Promise<WorkLogEntity[]> {
		const query: any = { userId: new mongoose.Types.ObjectId(userId) };
		
		if (filters.startDate && filters.endDate) {
			query.date = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
		}
		if (filters.projectId) query.projectId = new mongoose.Types.ObjectId(filters.projectId);
		if (filters.sprintId) query.sprintId = new mongoose.Types.ObjectId(filters.sprintId);

		const docs = await this.model.find(query).sort({ date: -1 });
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async findByProjectId(projectId: string): Promise<WorkLogEntity[]> {
		const docs = await this.model.find({ projectId: new mongoose.Types.ObjectId(projectId) });
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async findBySprintId(sprintId: string): Promise<WorkLogEntity[]> {
		const docs = await this.model.find({ sprintId: new mongoose.Types.ObjectId(sprintId) });
		return docs.map((doc) => this._workLogMapper.fromMongo(doc));
	}

	async getWorkLogAnalytics(companyId: string, filters: any = {}): Promise<any> {
		const matchQuery: any = {};
		
		if (filters.userId) matchQuery.userId = new mongoose.Types.ObjectId(filters.userId);
		if (filters.projectId) matchQuery.projectId = new mongoose.Types.ObjectId(filters.projectId);
		if (filters.sprintId) matchQuery.sprintId = new mongoose.Types.ObjectId(filters.sprintId);
		if (filters.startDate && filters.endDate) {
			matchQuery.date = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
		}

		const logs = await this.model.find(matchQuery)
			.populate('userId', 'name')
			.populate('projectId', 'name')
			.populate('taskId', 'title')
			.populate('subTaskId', 'title')
			.sort({ date: -1 });

		const totalHoursResult = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: null, total: { $sum: "$hours" } } }
		]);
		const totalHours = totalHoursResult.length > 0 ? totalHoursResult[0].total : 0;

		const hoursPerUser = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: "$userId", totalHours: { $sum: "$hours" } } },
			{ $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
			{ $unwind: "$user" },
			{ $project: { userId: "$_id", userName: "$user.name", totalHours: 1 } }
		]);

		const hoursPerSprint = await this.model.aggregate([
			{ $match: matchQuery },
			{ $group: { _id: "$sprintId", totalHours: { $sum: "$hours" } } },
			{ $lookup: { from: 'sprints', localField: '_id', foreignField: '_id', as: 'sprint' } },
			{ $unwind: "$sprint" },
			{ $project: { sprintId: "$_id", sprintName: "$sprint.name", totalHours: 1 } }
		]);

		return {
			logs,
			totalHours: parseFloat(totalHours.toFixed(2)),
			hoursPerUser: hoursPerUser.map((u: any) => ({ ...u, totalHours: parseFloat(u.totalHours.toFixed(2)) })),
			hoursPerSprint: hoursPerSprint.map((s: any) => ({ ...s, totalHours: parseFloat(s.totalHours.toFixed(2)) })),
		};
	}
}
