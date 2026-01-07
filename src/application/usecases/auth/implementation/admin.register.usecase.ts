import { randomBytes } from "crypto";
import { inject, injectable } from "inversify";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { generateOTP } from "@shared/utils/otp.generate.util";
import { hash } from "@shared/utils/password.hash.util";
import { sendOtpEmail } from "@shared/utils/send.otp.util";

import type { AdminRegisterDTO } from "@application/dtos/auth/admin.register.dto";
import type { IRegisterAdminUseCase } from "@application/usecases/auth/interface/admin.register.interface";

@injectable()
export class RegisterAdminUseCase implements IRegisterAdminUseCase {

    constructor(
        @inject(USER_TYPES.IUserRepository) private _userRepository: IUserRepository
    ) { }

    async execute(dto: AdminRegisterDTO): Promise<{ message: string, token: string }> {

        const existing = await this._userRepository.findByEmail(dto.email)
        if (existing) throw new ConflictError(ErrorMessage.EMAIL_ALREADY_EXISTS)


        const hashed = await hash(dto.password)

        const otp = generateOTP()
        const token = randomBytes(32).toString('hex')

        await redisClient.setex(
            `admin.otp:${token}`,
            3 * 60,

            JSON.stringify({
                name: dto.name,
                email: dto.email,
                password: hashed,
                companyName: dto.companyName,
                otp
            })

        )



        await sendOtpEmail(dto.email, otp)
        console.log(otp);

        return {
            message: "OTP sent successfully",
            token: token
        }


    }

}