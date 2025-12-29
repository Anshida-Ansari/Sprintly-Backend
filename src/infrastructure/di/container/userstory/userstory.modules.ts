import { ContainerModule } from "inversify";
import { IUserStroyRepository } from "src/infrastructure/db/repository/interface/user.story.interface";
import { USERSTORY_TYPE } from "../../types/userstory/userstory";
import { UserStoryModel } from "src/infrastructure/db/models/userstory.model";
import { UserStoryPersisitanceMapper } from "src/infrastructure/mappers/userstrory.mapper";
import { IUsersStory } from "src/infrastructure/db/interface/userstory.interface";
import { Model } from "mongoose";
import { ICreateUserstoryUsecase } from "src/application/usecases/userstory/interface/create.userstory.interface";
import { CreateUserstoryUseCase } from "src/application/usecases/userstory/implementation/create.userstory.usecase";
import { UserstoryController } from "src/presentation/http/controllers/userstory.controller";
import { UserStoryRepository } from "src/infrastructure/db/repository/implements/user.story.repository";

export const UserStoryModule = new ContainerModule(({bind})=>{
    // bind<IUserStroyRepository>(USERSTORY_TYPE.IUserStroyRepository).to()
    bind<Model<IUsersStory>>(USERSTORY_TYPE.UserStoryModel).toConstantValue(UserStoryModel)
    bind<UserStoryPersisitanceMapper>(USERSTORY_TYPE.UserStoryPersisitanceMapper).to(UserStoryPersisitanceMapper)
    bind<ICreateUserstoryUsecase>(USERSTORY_TYPE.ICreateUserstoryUsecase).to(CreateUserstoryUseCase)
    bind<UserstoryController>(USERSTORY_TYPE.UserstoryController).to(UserstoryController)
    bind<IUserStroyRepository>(USERSTORY_TYPE.IUserStroyRepository).to(UserStoryRepository)
})