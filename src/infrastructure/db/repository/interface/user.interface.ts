import type { UserEntity } from "src/domain/entities/user.entities";
import type { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<UserEntity> {
	findByEmail(email: string): Promise<UserEntity | null>;
	updatePassword(userId: string, password: string): Promise<void>;
}
