import type { UserProfileEntity } from "@domain/entities/user.profile.entities";
import type { IBaseRepository } from "./base.repository";

export interface IUserProfileRepository
	extends IBaseRepository<UserProfileEntity> {
	findByUserId(userId: string): Promise<UserProfileEntity | null>;
}
