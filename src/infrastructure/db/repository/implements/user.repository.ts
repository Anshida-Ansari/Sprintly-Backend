import { UserEntity } from "src/domain/entities/user.entities";
import { IUserRepository } from "../interface/user.interface";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { UserMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { IUser } from "../../interface/user.interface";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor(model : Model<IUser>){
        super(model)
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const doc = await this.findOne({email})
        return doc
        // return doc ? UserMapper.fromMongo(doc) : null
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.update(userId,{password})
    }

    // async createUser(data: any): Promise<any> {
    //     const mongoData = UserMapper.toMongo(data)
    //     const createUser = await this.create(mongoData)
    //     return UserMapper.fromMongo(createUser)
    // }

    // async updateUser(userId: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    //      const mongoData = UserMapper.toMongo(data as UserEntity);
    //     const update = await this.update(userId, mongoData);
    //     return update ? UserMapper.fromMongo(update) : null;
    // }

}