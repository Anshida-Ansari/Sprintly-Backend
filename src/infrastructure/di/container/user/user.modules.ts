import { ContainerModule } from "inversify";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { USER_TYPES } from "../../types/user/user.types";
import { Model } from "mongoose";
import { userModel } from "src/infrastructure/db/models/user.model";
import { UserPersistenceMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { Mode } from "fs";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { UserEntity } from "src/domain/entities/user.entities";
import { IUser } from "src/infrastructure/db/interface/user.interface";

export const UserModule = new ContainerModule(({bind})=>{
    bind<IUserRepository>(USER_TYPES.UserRepository).to(UserRepository)
    bind<UserPersistenceMapper>(USER_TYPES.UserPersistenceMapper).to(UserPersistenceMapper)
    bind<Model<IUser>>(USER_TYPES.userModel).toConstantValue(userModel)
})  