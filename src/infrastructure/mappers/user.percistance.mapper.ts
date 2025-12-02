import { UserEntity } from "src/domain/entities/user.entities";
import { IUser } from "../db/interface/user.interface";
import { Status } from "src/domain/enum/user/user.status.enum";
import { UserStatus } from "src/domain/enum/status.enum";
import { Types } from "mongoose";

export class UserPersistenceMapper {
    toMongo(user: UserEntity){
        return{
        
           name : user.name,
           email : user.email,
           password:user.password,
           role:user.role,
           status:user.status,
           companyId:user.companyId ,
           adminId:user.adminId
        }
    }   
    fromMongo(doc:any):UserEntity{
        return UserEntity.create({
            id: doc._id?.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            role: doc.role,
            status:(doc.status ?? 'active') as UserStatus,
            companyId: doc.companyId,
            adminId:doc.adminId
        })
    
    }
}


export const UserMapper = new UserPersistenceMapper()