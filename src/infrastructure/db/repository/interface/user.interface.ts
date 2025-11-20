import { UserEntity } from "src/domain/entities/user.entities";
import { IBaseRepository } from "./base.repository";
import { IUser } from "../../interface/user.interface";

export interface IUserRepository extends IBaseRepository<IUser>{
    findByEmail(email:string):Promise<IUser | null>
    updatePassword(userId:string,password:string):Promise<void>
    // createUser(data:UserEntity):Promise<T>
    // updateUser(userId:string,data:Partial<UserEntity>):Promise<T | null>

}