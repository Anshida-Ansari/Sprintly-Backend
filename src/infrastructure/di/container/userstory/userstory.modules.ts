import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { CreateUserstoryUseCase } from "../../../../application/usecases/userstory/implementation/create.userstory.usecase";
import { EditUserStoryUseCase } from "../../../../application/usecases/userstory/implementation/edit.userstory.usecase";
import { ListUserstoryUseCase } from "../../../../application/usecases/userstory/implementation/list.userstory.usecase";
import type { ICreateUserstoryUsecase } from "../../../../application/usecases/userstory/interface/create.userstory.interface";
import type { IEditUserstoryUseCase } from "../../../../application/usecases/userstory/interface/edit.usertory.interface";
import type { IListUserstoryUseCase } from "../../../../application/usecases/userstory/interface/list.userstory.interface";
import type { IUsersStory } from "../../../db/interface/userstory.interface";
import { UserStoryModel } from "../../../db/models/userstory.model";
import { UserStoryRepository } from "../../../db/repository/implements/user.story.repository";
import type { IUserStroyRepository } from "../../../db/repository/interface/user.story.interface";
import { UserStoryPersisitanceMapper } from "../../../mappers/userstrory.mapper";
import { UserstoryController } from "../../../../presentation/http/controllers/userstory.controller";
import { USERSTORY_TYPE } from "../../types/userstory/userstory";

export const UserStoryModule = new ContainerModule(({ bind }) => {
	// bind<IUserStroyRepository>(USERSTORY_TYPE.IUserStroyRepository).to()
	bind<Model<IUsersStory>>(USERSTORY_TYPE.UserStoryModel).toConstantValue(
		UserStoryModel,
	);
	bind<UserStoryPersisitanceMapper>(
		USERSTORY_TYPE.UserStoryPersisitanceMapper,
	).to(UserStoryPersisitanceMapper);
	bind<ICreateUserstoryUsecase>(USERSTORY_TYPE.ICreateUserstoryUsecase).to(
		CreateUserstoryUseCase,
	);
	bind<UserstoryController>(USERSTORY_TYPE.UserstoryController).to(
		UserstoryController,
	);
	bind<IUserStroyRepository>(USERSTORY_TYPE.IUserStroyRepository).to(
		UserStoryRepository,
	);
	bind<IEditUserstoryUseCase>(USERSTORY_TYPE.IEditUserstoryUseCase).to(
		EditUserStoryUseCase,
	);
	bind<IListUserstoryUseCase>(USERSTORY_TYPE.IListUserstoryUseCase).to(
		ListUserstoryUseCase,
	);
});
