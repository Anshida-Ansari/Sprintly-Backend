import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { Model } from "mongoose";
import { SubTaskPersisitanceMapper } from "@infrastructure/mappers/subtask.mapper";
import { ISubTaskRepository } from "../interface/subtask.interface";

@injectable()
export class SubtaskRepository extends BaseRepository<SubTaskEntity> implements ISubTaskRepository{
    constructor(
        @inject(SUBTASK_TYPE.SubTaskModel)
        model: Model<SubTaskEntity>,
        @inject(SUBTASK_TYPE.SubTaskPersisitanceMapper)
        private readonly _subtaskMapper: SubTaskPersisitanceMapper
    ){
        super(model)
    }

    async create(item: SubTaskEntity): Promise<SubTaskEntity> {
        const payload = this._subtaskMapper.toMongo(item);
        const result = await this.model.create(payload);
        return this._subtaskMapper.fromMongo(result);
    }

    async findById(id: string): Promise<SubTaskEntity | null> {
        const result = await this.model.findById(id);
        return result ? this._subtaskMapper.fromMongo(result) : null;
    }

    async update(id: string, entity: SubTaskEntity): Promise<SubTaskEntity | null> {
        const payload = this._subtaskMapper.toMongo(entity);
        const result = await this.model.findByIdAndUpdate(id, payload, { new: true , runValidators: true});
        return result ? this._subtaskMapper.fromMongo(result) : null;
    }

    async findByUserStoryId(userStoryId: string): Promise<SubTaskEntity[]> {
        const docs = await this.model.find({ userStoryId });
        return docs.map(doc => this._subtaskMapper.fromMongo(doc));
    }

    async findByCompanyId(companyId: string): Promise<SubTaskEntity[]> {
        const docs = await this.model.find({ companyId });
        return docs.map(doc => this._subtaskMapper.fromMongo(doc));
    }


}