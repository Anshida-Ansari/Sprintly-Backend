import { Mode } from "fs";
import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { UserEntity } from "src/domain/entities/user.entities";
import type { IUser } from "src/infrastructure/db/interface/user.interface";
import { userModel } from "src/infrastructure/db/models/user.model";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import type { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { UserPersistenceMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { USER_TYPES } from "../../types/user/user.types";

export const UserModule = new ContainerModule(({ bind }) => {
	bind<IUserRepository>(USER_TYPES.IUserRepository).to(UserRepository);
	bind<UserPersistenceMapper>(USER_TYPES.UserPersistenceMapper).to(
		UserPersistenceMapper,
	);
	bind<Model<IUser>>(USER_TYPES.userModel).toConstantValue(userModel);
});
