import { UserEntity } from "../../../domain/entities/user.entities";

export interface IUserMapper {
    toMongo(user: UserEntity): any; 
    fromMongo(doc: any): UserEntity;
}
