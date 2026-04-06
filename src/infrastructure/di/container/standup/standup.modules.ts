import { AddStandupCommentUseCase } from "@application/usecases/standup/implementation/add.standup.comment.usecase";
import { GetTodayStandupUseCase } from "@application/usecases/standup/implementation/get.today.standup.usecase";
import { ListStandupsUseCase } from "@application/usecases/standup/implementation/list.standup.usecase";
import { SubmitStandupUseCase } from "@application/usecases/standup/implementation/submit.standup.usecase";
import type { IAddStandupCommentUseCase } from "@application/usecases/standup/interface/add.standup.comment.interface";
import type { IGetTodayStandupUseCase } from "@application/usecases/standup/interface/get.today.standup.interface";
import type { IListStandupsUseCase } from "@application/usecases/standup/interface/list.standup.interface";
import type { ISubmitStandupUseCase } from "@application/usecases/standup/interface/submit.standup.interface";
import type { IStandup } from "@infrastructure/db/interface/standup.interface";
import { StandupModel } from "@infrastructure/db/models/standup.model";
import { StandupRepository } from "@infrastructure/db/repository/implements/standup.repository";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { StandupPersistanceMapper } from "@infrastructure/mappers/standup.sprints";
import { StandupController } from "@presentation/http/controllers/standup.controller";
import { ContainerModule } from "inversify";
import type { Model } from "mongoose";

export const StandupModule = new ContainerModule(({ bind }) => {
	bind<Model<IStandup>>(STANDUP_TYPES.StandupModel).toConstantValue(
		StandupModel,
	);
	bind<StandupPersistanceMapper>(STANDUP_TYPES.StandupPersistanceMapper).to(
		StandupPersistanceMapper,
	);
	bind<IStandupRepository>(STANDUP_TYPES.IStandupRepository).to(
		StandupRepository,
	);
	bind<IAddStandupCommentUseCase>(STANDUP_TYPES.IAddStandupCommentUseCase).to(
		AddStandupCommentUseCase,
	);
	bind<ISubmitStandupUseCase>(STANDUP_TYPES.ISubmitStandupUseCase).to(
		SubmitStandupUseCase,
	);
	bind<StandupController>(STANDUP_TYPES.StandupController).to(
		StandupController,
	);
	bind<IListStandupsUseCase>(STANDUP_TYPES.IListStandupsUseCase).to(
		ListStandupsUseCase,
	);
	bind<IGetTodayStandupUseCase>(STANDUP_TYPES.IGetTodayStandupUseCase).to(
		GetTodayStandupUseCase,
	);
});
