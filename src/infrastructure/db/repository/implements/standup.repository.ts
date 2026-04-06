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
		projectId: string,
		date: string,
	): Promise<StandupEntity | null> {
		const doc = await this.model.findOne({
			userId,
			projectId,
			date,
		});

		return doc ? this._standupMapper.fromMongo(doc) : null;
	}

	async findBySprintAndDate(
		sprintId: string,
		date?: string,
	): Promise<StandupEntity[]> {
		const query: any = { sprintId };

		if (date) {
			query.date = date;
		}

		const docs = await this.model
			.find(query)
			.populate("userId")
			.sort({ createdAt: 1 });

		return docs.map((doc) => this._standupMapper.fromMongo(doc));
	}

	async findByProjectAndDate(
		projectId: string,
		date?: string,
	): Promise<StandupEntity[]> {
		const query: any = { projectId };

		if (date) {
			query.date = date;
		}

		const docs = await this.model
			.find(query)
			.populate("userId")
			.sort({ createdAt: -1 });

		return docs.map((doc) => this._standupMapper.fromMongo(doc));
	}
}
