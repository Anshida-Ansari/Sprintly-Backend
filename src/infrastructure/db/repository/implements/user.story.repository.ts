import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import type { UserStoryEntity } from "../../../../domain/entities/user.story.entities";
import { USERSTORY_TYPE } from "../../../di/types/userstory/userstory";
import type { UserStoryPersisitanceMapper } from "../../../mappers/userstrory.mapper";
import type { IUserStroyRepository } from "../interface/user.story.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class UserStoryRepository extends BaseRepository<UserStoryEntity> implements IUserStroyRepository {
    constructor(
        @inject(USERSTORY_TYPE.UserStoryModel)
        model: Model<UserStoryEntity>,

        @inject(USERSTORY_TYPE.UserStoryPersisitanceMapper)
        private readonly _userstoryMapper: UserStoryPersisitanceMapper
    ) {
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

    async findById(id: string): Promise<UserStoryEntity | null> {
        const result = await this.model.findById(id)
        return result ? this._userstoryMapper.fromMongo(result) : null
    }
    async update(id: string, entity: UserStoryEntity): Promise<UserStoryEntity | null> {
        const payload = this._userstoryMapper.toMongo(entity)
        const result = await this.model.findByIdAndUpdate(id, payload, { new: true , runValidators: true})
        return result ? this._userstoryMapper.fromMongo(result) : null
    }

    async listByProject(params: {
        projectId: string
        companyId: string
        page: number
        limit: number
        search?: string
        sprintId?: string
        status?: string
    }) {
        const { page, limit, search, sprintId, status, projectId, companyId } = params

        const filter: any = {
            projectId,
            companyId
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" }
        }

        if (sprintId) {
            filter.sprintId = sprintId
        }

        if (status) {
            filter.status = status
        }

        const skip = (page - 1) * limit

        const [docs, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit),
            this.model.countDocuments(filter)
        ])

        return {
            data: docs.map(doc => this._userstoryMapper.fromMongo(doc)),
            total
        }
    }


}