import { UserEntity } from "src/domain/entities/user.entities";
import { IUser } from "../db/interface/user.interface";
import { Status } from "src/domain/enum/status.enum";

export class UserPersistenceMapper {
    toMongo(user: UserEntity):any{
        return{
           name : user.name,
           email : user.email,
           password:user.password,
           role:user.role,
           status:user.status,
           companyName:user.companyName,
           adminId:user.adminId || null
        }
    }
    fromMongo(doc:IUser):UserEntity{
        return UserEntity.create({
            id: doc._id?.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            role: doc.role,
            status: (doc.status ?? "active") as Status,
            companyName: doc.companyName  || undefined,
            adminId:doc.adminId?.toString()
        })
    
    }
}


export const UserMapper = new UserPersistenceMapper()