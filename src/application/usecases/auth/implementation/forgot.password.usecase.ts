import { inject, injectable } from "inversify";
import { IForgotPasswordUseCase } from "../interface/forgot.password.interface";
import { ForgotPasswordDTO } from "../../../dtos/auth/forgot.password.dto";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { generateOTP } from "../../../../shared/utils/otp.generate.util";
import { sendOtpEmail } from "../../../../shared/utils/send.otp.util";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute({email}: ForgotPasswordDTO): Promise<{ message: string; }> {
        try {
            const user = await this._userRepository.findByEmail(email)
            if(!user){
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }


            const otp  = generateOTP()
            const expiryTime = 3 * 60

            await redisClient.setex(
                `forgot-otp:${email}`,
                expiryTime,
                JSON.stringify({otp})
            )

            console.log(email,otp);

            await sendOtpEmail(email,otp)

            return {
                message:'forgot password otp is sended'
            }
            
        } catch (error) {
            throw error
        }
    }
}