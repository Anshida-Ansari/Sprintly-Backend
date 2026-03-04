import {  IUserProfile } from "@infrastructure/db/interface/user.profile.model";
import { UserProfileModel } from "@infrastructure/db/models/user.profile.model";
import { UserProfileReposiotry } from "@infrastructure/db/repository/implements/user.profile.repository";
import { IUserProfileRepository } from "@infrastructure/db/repository/interface/user.profile.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { UserProfilePersistenceMapper } from "@infrastructure/mappers/user.profile.persistance";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const UserProfileModule = new ContainerModule(({bind})=>{
    bind<Model<IUserProfile>>(USER_PROFILE_TYPE.UserProfileModel).toConstantValue(UserProfileModel)
    bind<IUserProfileRepository>(USER_PROFILE_TYPE.IUserProfileRepository).to(UserProfileReposiotry)
    bind<UserProfilePersistenceMapper>(USER_PROFILE_TYPE.UserProfilePersistenceMapper).to(UserProfilePersistenceMapper)

})