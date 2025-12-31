import { inject, injectable } from "inversify";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { generateOTP } from "../../../../shared/utils/otp.generate.util";
import { sendOtpEmail } from "../../../../shared/utils/send.otp.util";
import type { ForgotPasswordDTO } from "../../../dtos/auth/forgot.password.dto";
import type { IForgotPasswordUseCase } from "../interface/forgot.password.interface";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository
    ) { }

    async execute({ email }: ForgotPasswordDTO): Promise<{ message: string; }> {
        const user = await this._userRepository.findByEmail(email)
        if (!user) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND)
        }


        const otp = generateOTP()
        const expiryTime = 3 * 60

        await redisClient.setex(
            `forgot-otp:${email}`,
            expiryTime,
            JSON.stringify({ otp })
        )

        console.log(email, otp);

        await sendOtpEmail(email, otp)

        return {
            message: 'forgot password otp is sended'
        }


    }
}