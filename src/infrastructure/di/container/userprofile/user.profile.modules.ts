import { GetProfileUseCase } from "@application/usecases/userprofile/imeplementation/get.profile.usecase";
import { UpdateProfileUseCase } from "@application/usecases/userprofile/imeplementation/update.profile.usecase.usecase";
import { IGetProfileUseCase } from "@application/usecases/userprofile/interface/get.profile.usecase.interface";
import { IUpdateProfileUseCase } from "@application/usecases/userprofile/interface/update.profile.usecase.interface";
import {  IUserProfile } from "@infrastructure/db/interface/user.profile.model";
import { UserProfileModel } from "@infrastructure/db/models/user.profile.model";
import { UserProfileReposiotry } from "@infrastructure/db/repository/implements/user.profile.repository";
import { IUserProfileRepository } from "@infrastructure/db/repository/interface/user.profile.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { UserProfilePersistenceMapper } from "@infrastructure/mappers/user.profile.persistance";
import { UserProfileController } from "@presentation/http/controllers/user.profile.controller";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";

export const UserProfileModule = new ContainerModule(({bind})=>{
    bind<Model<IUserProfile>>(USER_PROFILE_TYPE.UserProfileModel).toConstantValue(UserProfileModel)
    bind<IUserProfileRepository>(USER_PROFILE_TYPE.IUserProfileRepository).to(UserProfileReposiotry)
    bind<UserProfilePersistenceMapper>(USER_PROFILE_TYPE.UserProfilePersistenceMapper).to(UserProfilePersistenceMapper)
    bind<IUpdateProfileUseCase>(USER_PROFILE_TYPE.IUpdateProfileUseCase).to(UpdateProfileUseCase)
    bind<UserProfileController>(USER_PROFILE_TYPE.UserProfileController).to(UserProfileController)
    bind<IGetProfileUseCase>(USER_PROFILE_TYPE.IGetProfileUseCase).to(GetProfileUseCase)

})