import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { UserEntity } from "src/domain/entities/user.entities";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { Status } from "src/domain/enum/status.enum";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { UserMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { generateOTP } from "src/shared/utils/otp.generate.util";
import { sendOtpEmail } from "src/shared/utils/send.otp.util";

export class RegisterAdminUseCase{
    constructor(private userRepostitory:UserRepository){}

    async execute(dto:AdminRegisterDTO){

        try {

          const existing = await this.userRepostitory.findByEmail(dto.email)
          if(existing) throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
        

          const hashed = await hash(dto.password,10)

          const otp = generateOTP()
          const token = randomBytes(32).toString('hex')

          await redisClient.setex(
            `admin.otp:${token}`,
             3*60,
             
             JSON.stringify({
                name:dto.name,
                email:dto.email,
                password:hashed,
                companyName:dto.companyName,
                otp
             })

          )

       

        await sendOtpEmail(dto.email,otp)
      console.log(otp);

         return { 
                message: "OTP sent successfully",
                token: token 
            }
          
        } catch (error) {
            throw error
        }
    }

}