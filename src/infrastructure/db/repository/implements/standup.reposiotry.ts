import type { StandupEntity } from "@domain/entities/standup.entity";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import type { StandupPersistanceMapper } from "@infrastructure/mappers/standup.sprints";
import { inject, injectable } from "inversify";
import { type Model, model } from "mongoose";
import type { IStandupRepository } from "../interface/standup.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class StandupRepository
	extends BaseRepository<StandupEntity>
	implements IStandupRepository
{
	constructor(
		@inject(STANDUP_TYPES.StandupModel)
		model: Model<StandupEntity>,
		@inject(STANDUP_TYPES.StandupPersistanceMapper)
		private readonly _standupMapper: StandupPersistanceMapper,
	) {
		super(model);
	}

	async create(entity: StandupEntity): Promise<StandupEntity> {
		const payload = this._standupMapper.toMongo(entity);
		const result = await this.model.create(payload);
		return this._standupMapper.fromMongo(result);
	}

	async update(
		id: string,
		entity: StandupEntity,
	): Promise<StandupEntity | null> {
		const payload = this._standupMapper.toMongo(entity);
		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
		});
		return result ? this._standupMapper.fromMongo(result) : null;
	}

	async findById(id: string): Promise<StandupEntity | null> {
		const result = this.model.findById(id);
		return result ? this._standupMapper.fromMongo(result) : null;
	}

	async findUserStandupForDate(
		userId: string,
		sprintId: string,
		date: Date,
	): Promise<StandupEntity | null> {
		const startDay = new Date(date);
		startDay.setHours(0, 0, 0, 0);
		const endDay = new Date(date);
		endDay.setHours(23, 59, 59, 999);

		const doc = await this.model.findOne({
			userId,
			sprintId,
			createdAt: { $gte: startDay, $lte: endDay },
		});

		return doc ? this._standupMapper.fromMongo(doc) : null;
	}

	async findBySprintAndDate(
		sprintId: string,
		date: Date,
	): Promise<StandupEntity[]> {
		const startOfDate = new Date(date);
		startOfDate.setHours(0, 0, 0, 0);

		const endOfDate = new Date(date);
		endOfDate.setHours(23, 59, 59, 999);

		const docs = await this.model
			.find({
				sprintId,
				createdAt: { $gte: startOfDate, $lte: endOfDate },
			})
			.populate("userId")
			.sort({ createdAt: 1 });

		return docs.map((doc) => this._standupMapper.fromMongo(doc));
	}
}
