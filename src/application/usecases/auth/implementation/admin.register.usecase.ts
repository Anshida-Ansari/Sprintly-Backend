import { hash } from "src/shared/utils/password.hash.util"
import { randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { UserEntity } from "src/domain/entities/user.entities";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { UserMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { generateOTP } from "src/shared/utils/otp.generate.util";
import { sendOtpEmail } from "src/shared/utils/send.otp.util";
import { IRegisterAdminUseCase } from "../interface/admin.register.interface";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";

@injectable()   
export class RegisterAdminUseCase implements IRegisterAdminUseCase{

    constructor(
        @inject(USER_TYPES.UserRepository) private _userRepository:IUserRepository
    ){}

    async execute(dto:AdminRegisterDTO):Promise<{message: string, token: string}>{

        try {

          const existing = await this._userRepository.findByEmail(dto.email)
          if(existing) throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
        

          const hashed = await hash(dto.password)

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