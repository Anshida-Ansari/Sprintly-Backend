import { CompleteSprintUseCase } from "@application/usecases/sprints/implementation/complete.sprints.usecase";
import { CreateSprintUseCase } from "@application/usecases/sprints/implementation/create.sprints.usecase";
import { DeleteSprintUseCase } from "@application/usecases/sprints/implementation/delete.sprints.usecase";
import { EditSprintUseCase } from "@application/usecases/sprints/implementation/edit.sprints.usecase";
import { ListSprintsUseCase } from "@application/usecases/sprints/implementation/list.sprints.usecase";
import { StartSprtintsUseCase } from "@application/usecases/sprints/implementation/start.sprits.usecase";
import type { ICompleteSprintUseCase } from "@application/usecases/sprints/interface/complete.sprints.interface";
import type { ICreateSprintUseCase } from "@application/usecases/sprints/interface/create.sprint.interface";
import type { IDeleteSprintUseCase } from "@application/usecases/sprints/interface/delete.sprints.interface";
import type { IEditSprintUseCase } from "@application/usecases/sprints/interface/edit.sprints.interface";
import type { IListSprintsUseCase } from "@application/usecases/sprints/interface/list.sprints.interface";
import type { IStartSprintUseCase } from "@application/usecases/sprints/interface/start.sprint.interface";
import type { ISprints } from "@infrastructure/db/interface/sprints.interface";
import { SprintModel } from "@infrastructure/db/models/sprints.model";
import { SprintsRepository } from "@infrastructure/db/repository/implements/sprints.repository";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { SprintPersistenceMapper } from "@infrastructure/mappers/sprints.mapper";
import { SprintController } from "@presentation/http/controllers/sprint.controller";
import { ContainerModule } from "inversify";
import type { Model } from "mongoose";

export const SprintModule = new ContainerModule(({ bind }) => {
	bind<Model<ISprints>>(SPRINTS_TYPE.SprintModel).toConstantValue(SprintModel);
	bind<SprintPersistenceMapper>(SPRINTS_TYPE.SprintPersistenceMapper).to(
		SprintPersistenceMapper,
	);
	bind<ISprintRepository>(SPRINTS_TYPE.ISprintRepository).to(SprintsRepository);
	bind<ICreateSprintUseCase>(SPRINTS_TYPE.ICreateSprintUseCase).to(
		CreateSprintUseCase,
	);
	bind<SprintController>(SPRINTS_TYPE.SprintController).to(SprintController);
	bind<IListSprintsUseCase>(SPRINTS_TYPE.IListSprintsUseCase).to(
		ListSprintsUseCase,
	);
	bind<IEditSprintUseCase>(SPRINTS_TYPE.IEditSprintUseCase).to(
		EditSprintUseCase,
	);
	bind<IStartSprintUseCase>(SPRINTS_TYPE.IStartSprintUseCase).to(
		StartSprtintsUseCase,
	);
	bind<ICompleteSprintUseCase>(SPRINTS_TYPE.ICompleteSprintUseCase).to(
		CompleteSprintUseCase,
	);
	bind<IDeleteSprintUseCase>(SPRINTS_TYPE.IDeleteSprintUseCase).to(
		DeleteSprintUseCase,
	);
});
