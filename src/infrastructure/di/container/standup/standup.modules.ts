import { IStandup } from "@infrastructure/db/interface/standup.interface";
import { StandupModel } from "@infrastructure/db/models/standup.model";
import { StandupRepository } from "@infrastructure/db/repository/implements/standup.reposiotry";
import { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { StandupPersistanceMapper } from "@infrastructure/mappers/standup.sprints";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const StandupModule = new ContainerModule(({bind})=>{
    bind<Model<IStandup>>(STANDUP_TYPES.StandupModel).toConstantValue(StandupModel)
    bind<StandupPersistanceMapper>(STANDUP_TYPES.StandupPersistanceMapper).to(StandupPersistanceMapper)
    bind<IStandupRepository>(STANDUP_TYPES.ISubTaskRepository).to(StandupRepository)
})