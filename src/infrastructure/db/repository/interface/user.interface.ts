import { UserEntity } from "src/domain/entities/user.entities";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<UserEntity>{
    findByEmail(email:string):Promise<UserEntity | null>
    updatePassword(userId:string,password:string):Promise<void>

}
