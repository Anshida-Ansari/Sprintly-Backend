import { AddStandupCommentUseCase } from "@application/usecases/standup/implementaion/add.standup.comment.usecase";
import { GetTodayStandupUseCase } from "@application/usecases/standup/implementaion/get.today.standup.usecase";
import { ListStandupsUseCase } from "@application/usecases/standup/implementaion/list.standup.usecase";
import { SubmitStandupUseCase } from "@application/usecases/standup/implementaion/submit.standup.usecase";
import { IAddStandupCommentUseCase } from "@application/usecases/standup/interface/add.standup.comment.interface";
import { IGetTodayStandupUseCase } from "@application/usecases/standup/interface/get.today.standup.interface";
import { IListStandupsUseCase } from "@application/usecases/standup/interface/list.standup.interface";
import { ISubmitStandupUseCase } from "@application/usecases/standup/interface/submit.standup.interface";
import { IStandup } from "@infrastructure/db/interface/standup.interface";
import { StandupModel } from "@infrastructure/db/models/standup.model";
import { StandupRepository } from "@infrastructure/db/repository/implements/standup.reposiotry";
import { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { StandupPersistanceMapper } from "@infrastructure/mappers/standup.sprints";
import { StandupController } from "@presentation/http/controllers/standup.controller";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const StandupModule = new ContainerModule(({bind})=>{
    bind<Model<IStandup>>(STANDUP_TYPES.StandupModel).toConstantValue(StandupModel)
    bind<StandupPersistanceMapper>(STANDUP_TYPES.StandupPersistanceMapper).to(StandupPersistanceMapper)
    bind<IStandupRepository>(STANDUP_TYPES.IStandupRepository).to(StandupRepository)
    bind<IAddStandupCommentUseCase>(STANDUP_TYPES.IAddStandupCommentUseCase).to(AddStandupCommentUseCase)
    bind<ISubmitStandupUseCase>(STANDUP_TYPES.ISubmitStandupUseCase).to(SubmitStandupUseCase)
    bind<StandupController>(STANDUP_TYPES.StandupController).to(StandupController)
    bind<IListStandupsUseCase>(STANDUP_TYPES.IListStandupsUseCase).to(ListStandupsUseCase)
    bind<IGetTodayStandupUseCase>(STANDUP_TYPES.IGetTodayStandupUseCase).to(GetTodayStandupUseCase)
})