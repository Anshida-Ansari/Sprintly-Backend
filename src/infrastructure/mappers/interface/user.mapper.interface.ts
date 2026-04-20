import type { UserEntity } from "../../../domain/entities/user.entities";

export interface IUserMapper {
	toMongo(user: UserEntity): Record<string, unknown>;
	fromMongo(doc: any): UserEntity;
}
