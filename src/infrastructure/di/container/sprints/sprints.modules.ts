import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import type { ISprints } from "@infrastructure/db/interface/sprints.interface";
import type { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { SprintsRepository } from "@infrastructure/db/repository/implements/sprints.repository";
import { SprintModel } from "@infrastructure/db/models/sprints.model";
import { SprintPersistenceMapper } from "@infrastructure/mappers/sprints.mapper";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import type { ICreateSprintUseCase } from "@application/usecases/sprints/interface/create.sprint.interface";
import { CreateSprintUseCase } from "@application/usecases/sprints/implementation/create.sprints.usecase";
import type { IListSprintsUseCase } from "@application/usecases/sprints/interface/list.sprints.interface";
import { ListSprintsUseCase } from "@application/usecases/sprints/implementation/list.sprints.usecase";
import type { IEditSprintUseCase } from "@application/usecases/sprints/interface/edit.sprints.interface";
import { EditSprintUseCase } from "@application/usecases/sprints/implementation/edit.sprints.usecase";
import { SprintController } from "@presentation/http/controllers/sprint.controller";
import { IStartSprintUseCase } from "@application/usecases/sprints/interface/start.sprint.interface";
import { StartSprtintsUseCase } from "@application/usecases/sprints/implementation/start.sprits.usecase";

export const SprintModule = new ContainerModule(({bind})=>{
    bind<Model<ISprints>>(SPRINTS_TYPE.SprintModel).toConstantValue(SprintModel)
    bind<SprintPersistenceMapper>(SPRINTS_TYPE.SprintPersistenceMapper).to(SprintPersistenceMapper)
    bind<ISprintReposiotry>(SPRINTS_TYPE.ISprintReposiotry).to(SprintsRepository)
    bind<ICreateSprintUseCase>(SPRINTS_TYPE.ICreateSprintUseCase).to(CreateSprintUseCase)
    bind<SprintController>(SPRINTS_TYPE.SprintController).to(SprintController)
    bind<IListSprintsUseCase>(SPRINTS_TYPE.IListSprintsUseCase).to(ListSprintsUseCase)
    bind<IEditSprintUseCase>(SPRINTS_TYPE.IEditSprintUseCase).to(EditSprintUseCase)
    bind<IStartSprintUseCase>(SPRINTS_TYPE.IStartSprintUseCase).to(StartSprtintsUseCase)

})