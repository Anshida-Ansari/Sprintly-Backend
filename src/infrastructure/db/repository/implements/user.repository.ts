import { inject, injectable } from "inversify";
import { type Model, model, models } from "mongoose";
import type { UserEntity } from "src/domain/entities/user.entities";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { UserMapper, type UserPersistenceMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { IUser } from "../../interface/user.interface";
import type { IUserRepository } from "../interface/user.interface";
import { BaseRepository } from "./base.repository";


@injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepository{
     private readonly userPersistenceMapper : UserPersistenceMapper;

    constructor(
        @inject(USER_TYPES.userModel) 
       model: Model<UserEntity>,
        @inject(USER_TYPES.UserPersistenceMapper) 
        private readonly _userMapper: UserPersistenceMapper,
    
    ){
        super(model)
        this._userMapper = _userMapper
        
    }
    

    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.findOne({email})
        return doc? this._userMapper.fromMongo(doc):null
  
       
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.update(userId,{password})
    }

  

}