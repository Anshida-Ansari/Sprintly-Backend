import { ContainerModule } from "inversify";
import { Model } from "mongoose";
import { ISprints } from "src/infrastructure/db/interface/sprints.interface";
import { SPRINTS_TYPE } from "../../types/spirnts/sprints.types";
import { SprintModel } from "src/infrastructure/db/models/sprints.model";
import { SprintPersistenceMapper } from "src/infrastructure/mappers/sprints.mapper";

export const SprintModule = new ContainerModule(({bind})=>{
    bind<Model<ISprints>>(SPRINTS_TYPE.SprintModel).toConstantValue(SprintModel)
    bind<SprintPersistenceMapper>(SPRINTS_TYPE.SprintPersistenceMapper).to(SprintPersistenceMapper)

})