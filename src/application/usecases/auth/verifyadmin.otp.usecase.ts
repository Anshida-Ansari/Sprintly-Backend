import { parse } from "path";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";
import { UserEntity } from "src/domain/entities/user.entities";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { Status } from "src/domain/enum/status.enum";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { UserMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
export class VerifyAdminOtpUseCase{
    constructor(private userRepositry:UserRepository){}

    async execute(dto:VerifyOtpDTO){
        try {
            
       
            

            const key = `admin.otp:${dto.token}`
            const data = await redisClient.get(key)



            if(!data){
                throw new Error(ErrorMessage.OTP_EXPIRED)
            }

            const parsed = JSON.parse(data)
            

        
            if(parsed.otp.toString() !== dto.otp.toString()){
                throw new Error(ErrorMessage.OTP_INVALID)
            }
            
            const adminEntity = UserEntity.create({
                name:parsed.name,
                email:parsed.email,
                password:parsed.password,
                role:Role.ADMIN,
                status:Status.APPROVED,
                companyName:parsed.companyName,
                adminId:undefined
            })

            const toMongo = UserMapper.toMongo(adminEntity)

            const newAdmin = await this.userRepositry.create(toMongo)

            await redisClient.del(key)

            return {
                message: "Admin registered successfully",
                user: {
                    id: newAdmin._id?.toString(),
                    name: newAdmin.name,
                    email: newAdmin.email
                }
            }
        } catch (error) {

             
            throw error
        }
    }
}