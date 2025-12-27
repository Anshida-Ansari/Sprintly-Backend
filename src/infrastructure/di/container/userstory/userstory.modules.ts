import { ContainerModule } from "inversify";
import { IUserStroyRepository } from "src/infrastructure/db/repository/interface/user.story.interface";
import { USERSTORY_TYPE } from "../../types/userstory/userstory";
import { UserStoryModel } from "src/infrastructure/db/models/userstory.model";
import { UserStoryPersisitanceMapper } from "src/infrastructure/mappers/userstrory.mapper";
import { IUsersStory } from "src/infrastructure/db/interface/userstory.interface";
import { Model } from "mongoose";

export const UserStoryModule = new ContainerModule(({bind})=>{
    // bind<IUserStroyRepository>(USERSTORY_TYPE.IUserStroyRepository).to()
    bind<Model<IUsersStory>>(USERSTORY_TYPE.UserStoryModel).toConstantValue(UserStoryModel)
    bind<UserStoryPersisitanceMapper>(USERSTORY_TYPE.UserStoryPersisitanceMapper).to(UserStoryPersisitanceMapper)
})