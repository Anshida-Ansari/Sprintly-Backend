import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IUserStroyRepository } from "../interface/user.story.interface";
import { USERSTORY_TYPE } from "src/infrastructure/di/types/userstory/userstory";
import { Model } from "mongoose";
import { UserStoryEntity } from "src/domain/entities/user.story.entities";
import { UserStoryPersisitanceMapper } from "src/infrastructure/mappers/userstrory.mapper";

@injectable()
export class UserStoryRepository extends BaseRepository<UserStoryEntity> implements IUserStroyRepository{
    constructor(
        @inject(USERSTORY_TYPE.UserStoryModel)
        model: Model<UserStoryEntity>,

        @inject(USERSTORY_TYPE.UserStoryPersisitanceMapper)
        private readonly _userstoryMapper: UserStoryPersisitanceMapper
    ){
        super(model)
        // this._userstoryMapper = _userstoryMapper
    }

    async create(item: UserStoryEntity): Promise<UserStoryEntity> {
    const payload = this._userstoryMapper.toMongo(item); 
    const result = await this.model.create(payload);
    
    return this._userstoryMapper.fromMongo(result);
}


    async findByProjectId(projectId: string): Promise<UserStoryEntity[]> {
      const docs = await this.model.find({ projectId });
    return docs.map(doc => this._userstoryMapper.fromMongo(doc));
    }

    async findBySprintId(sprintId: string): Promise<UserStoryEntity[]> {
       const docs = await this.model.find({ sprintId });
    return docs.map(doc => this._userstoryMapper.fromMongo(doc));
    }
}