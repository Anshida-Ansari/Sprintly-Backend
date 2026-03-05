import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { UserProfileEntity } from "@domain/entities/user.profile.entities";
import { IUserProfileRepository } from "../interface/user.profile.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { Model } from "mongoose";
import { UserProfilePersistenceMapper } from "@infrastructure/mappers/user.profile.persistance";

@injectable()
export class UserProfileReposiotry extends BaseRepository<UserProfileEntity> implements IUserProfileRepository{
    constructor(
        @inject(USER_PROFILE_TYPE.UserProfileModel)
        model: Model<UserProfileEntity>,
        @inject(USER_PROFILE_TYPE.UserProfilePersistenceMapper)
        private readonly _userProfileMapper: UserProfilePersistenceMapper
    ){
        super(model)
    }

    async create(entity: UserProfileEntity): Promise<UserProfileEntity> {
		const payload = this._userProfileMapper.toMongo(entity);
		const result = await this.model.create(payload);
		return this._userProfileMapper.fromMongo(result);
	}

	async update(
		id: string,
		entity: UserProfileEntity
	): Promise<UserProfileEntity | null> {
		const payload = this._userProfileMapper.toMongo(entity);

		const result = await this.model.findByIdAndUpdate(id, payload, {
			new: true,
		});

		return result
			? this._userProfileMapper.fromMongo(result)
			: null;
	}

	async findByUserId(userId: string): Promise<UserProfileEntity | null> {
		const doc = await this.model.findOne({ userId });

		return doc
			? this._userProfileMapper.fromMongo(doc)
			: null;
	}
}