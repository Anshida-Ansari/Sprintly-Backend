import type { UserProfileEntity } from "@domain/entities/user.profile.entities";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import type { UserProfilePersistenceMapper } from "@infrastructure/mappers/user.profile.persistence";
import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import type { IUserProfileRepository } from "../interface/user.profile.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class UserProfileRepository
	extends BaseRepository<UserProfileEntity>
	implements IUserProfileRepository
{
	constructor(
		@inject(USER_PROFILE_TYPE.UserProfileModel)
		model: Model<UserProfileEntity>,
		@inject(USER_PROFILE_TYPE.UserProfilePersistenceMapper)
		private readonly _userProfileMapper: UserProfilePersistenceMapper,
	) {
		super(model);
	}

	async create(entity: UserProfileEntity): Promise<UserProfileEntity> {
		const payload = this._userProfileMapper.toMongo(entity);
		const result = await this.model.create(payload);
		return this._userProfileMapper.fromMongo(result);
	}

	async update(
		id: string,
		entity: UserProfileEntity,
	): Promise<UserProfileEntity | null> {
		const payload = this._userProfileMapper.toMongo(entity);

		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
		});

		return result ? this._userProfileMapper.fromMongo(result) : null;
	}

	async findByUserId(userId: string): Promise<UserProfileEntity | null> {
		const doc = await this.model.findOne({ userId });

		return doc ? this._userProfileMapper.fromMongo(doc) : null;
	}

	async findOne(
		filter: Record<string, unknown>,
	): Promise<UserProfileEntity | null> {
		const doc = await this.model.findOne(filter);

		return doc ? this._userProfileMapper.fromMongo(doc) : null;
	}
}
