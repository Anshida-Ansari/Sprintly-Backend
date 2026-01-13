import { CreateSubTaskUseCase } from "@application/usecases/subtask/implementation/create.subtask.usecase";
import { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import { ISubtTask } from "@infrastructure/db/interface/subtask.interface";
import { SubTaskModel } from "@infrastructure/db/models/subtask.model";
import { SubtaskRepository } from "@infrastructure/db/repository/implements/subtask.repository";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { SubTaskPersisitanceMapper } from "@infrastructure/mappers/subtask.mapper";
import { SubTaskController } from "@presentation/http/controllers/subtask.controller";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const SubtaskModule = new ContainerModule(({bind})=>{
    bind<Model<ISubtTask>>(SUBTASK_TYPE.SubTaskModel).toConstantValue(
        SubTaskModel
    )
    bind<SubTaskPersisitanceMapper>(SUBTASK_TYPE.SubTaskPersisitanceMapper).to(
        SubTaskPersisitanceMapper
    )
    bind<ISubTaskRepository>(SUBTASK_TYPE.ISubTaskRepository).to(
        SubtaskRepository
    )
    bind<ICreateSubTaskUseCase>(SUBTASK_TYPE.ICreateSubTaskUseCase).to(
        CreateSubTaskUseCase
    )
    bind<SubTaskController>(SUBTASK_TYPE.SubTaskController).to(
        SubTaskController
    )
    
})