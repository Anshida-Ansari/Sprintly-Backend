import type { UserEntity } from "../../../domain/entities/user.entity";

export interface IUserMapper {
	toMongo(user: UserEntity): Record<string, unknown>;
	fromMongo(doc: any): UserEntity;
}
