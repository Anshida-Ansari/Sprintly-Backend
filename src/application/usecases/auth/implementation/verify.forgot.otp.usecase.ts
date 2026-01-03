import { injectable } from "inversify";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { validationError } from "../../../../shared/utils/error-handling/errors/validation.error";
import type { IVerifyForgotPasswordOtpUseCase } from "../interface/verify.forgot.otp.interface";

@injectable()
export class VerifyForgotPasswordOtpUseCase implements IVerifyForgotPasswordOtpUseCase {
    async execute(email: string, otp: string): Promise<{ message: string }> {
        const key = `forgot-otp:${email}`;
        const data = await redisClient.get(key);

        if (!data) {
            throw new NotFoundError(ErrorMessage.OTP_EXPIRED);
        }

        const parsed = JSON.parse(data);

        if (parsed.otp.toString() !== otp.toString()) {
            throw new validationError(ErrorMessage.OTP_INVALID);
        }


        return {
            message: "OTP verified successfully",
        };
    }
}
