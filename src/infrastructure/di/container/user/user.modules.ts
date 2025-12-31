import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { UserEntity } from "../../../../domain/entities/user.entities";
import type { IUser } from "../../../db/interface/user.interface";
import { userModel } from "../../../db/models/user.model";
import { UserRepository } from "../../../db/repository/implements/user.repository";
import type { IUserRepository } from "../../../db/repository/interface/user.interface";
import { UserPersistenceMapper } from "../../../mappers/user.percistance.mapper";
import { USER_TYPES } from "../../types/user/user.types";

export const UserModule = new ContainerModule(({ bind }) => {
	bind<IUserRepository>(USER_TYPES.IUserRepository).to(UserRepository);
	bind<UserPersistenceMapper>(USER_TYPES.UserPersistenceMapper).to(
		UserPersistenceMapper,
	);
	bind<Model<IUser>>(USER_TYPES.userModel).toConstantValue(userModel);
});
