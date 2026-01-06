import { ContainerModule } from "inversify";
import { Model } from "mongoose";
import { ISprints } from "src/infrastructure/db/interface/sprints.interface";
import { SPRINTS_TYPE } from "../../types/spirnts/sprints.types";
import { SprintModel } from "src/infrastructure/db/models/sprints.model";
import { SprintPersistenceMapper } from "src/infrastructure/mappers/sprints.mapper";
import { ISprintReposiotry } from "src/infrastructure/db/repository/interface/sprints.interface";
import { SprintsRepository } from "src/infrastructure/db/repository/implements/sprints.repository";
import { ICreateSprintUseCase } from "src/application/usecases/sprints/interface/create.sprint.interface";
import { CreateSprintUseCase } from "src/application/usecases/sprints/implementation/create.sprints.usecase";
import { SprintController } from "src/presentation/http/controllers/sprint.controller";
import { IListSprintsUseCase } from "src/application/usecases/sprints/interface/list.sprints";
import { ListSprintsUseCase } from "src/application/usecases/sprints/implementation/list.sprints.usecase";

export const SprintModule = new ContainerModule(({bind})=>{
    bind<Model<ISprints>>(SPRINTS_TYPE.SprintModel).toConstantValue(SprintModel)
    bind<SprintPersistenceMapper>(SPRINTS_TYPE.SprintPersistenceMapper).to(SprintPersistenceMapper)
    bind<ISprintReposiotry>(SPRINTS_TYPE.ISprintReposiotry).to(SprintsRepository)
    bind<ICreateSprintUseCase>(SPRINTS_TYPE.ICreateSprintUseCase).to(CreateSprintUseCase)
    bind<SprintController>(SPRINTS_TYPE.SprintController).to(SprintController)
    bind<IListSprintsUseCase>(SPRINTS_TYPE.IListSprintsUseCase).to(ListSprintsUseCase)

})