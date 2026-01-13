import { ISubtTask } from "@infrastructure/db/interface/subtask.interface";
import { SubTaskModel } from "@infrastructure/db/models/subtask.model";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { SubTaskPersisitanceMapper } from "@infrastructure/mappers/subtask.mapper";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const SubtaskModule = new ContainerModule(({bind})=>{
    bind<Model<ISubtTask>>(SUBTASK_TYPE.SubTaskModel).toConstantValue(
        SubTaskModel
    )
    bind<SubTaskPersisitanceMapper>(
        SUBTASK_TYPE.SubTaskPersisitanceMapper
    )
})