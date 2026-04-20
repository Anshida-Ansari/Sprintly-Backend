import type { UserEntity } from "../../../../domain/entities/user.entity";
import type { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<UserEntity> {
	findByEmail(email: string): Promise<UserEntity | null>;
	updatePassword(userId: string, password: string): Promise<void>;
}
