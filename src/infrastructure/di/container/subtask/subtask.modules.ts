import { CreateSubTaskUseCase } from "@application/usecases/subtask/implementation/create.subtask.usecase";
import { ListSubtasksByStoryUseCase } from "@application/usecases/subtask/implementation/list.subtask.usecase";
import { UpdateSubtaskStatusUseCase } from "@application/usecases/subtask/implementation/update.subtask.status.usecasets";
import { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import { IListSubtasksByStoryUseCase } from "@application/usecases/subtask/interface/list.subtask.interface";
import { IUpdateSubtaskStatusUseCase } from "@application/usecases/subtask/interface/update.subtask.status.interface";
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
    bind<IUpdateSubtaskStatusUseCase>(SUBTASK_TYPE.IUpdateSubtaskStatusUseCase).to(
        UpdateSubtaskStatusUseCase
    )
    bind<IListSubtasksByStoryUseCase>(SUBTASK_TYPE.IListSubtasksByStoryUseCase).to(
        ListSubtasksByStoryUseCase
    )
    
})