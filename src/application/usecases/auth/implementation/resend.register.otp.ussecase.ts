import { injectable } from "inversify";
import { IResendAdminOtpUseCase } from "../interface/resend.register.otp.interface";
import { ResendAdminOtpDTO } from "src/application/dtos/auth/resend.otp.dto";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { generateOTP } from "src/shared/utils/otp.generate.util";
import { sendOtpEmail } from "src/shared/utils/send.otp.util";
import { log } from "node:console";

@injectable()
export class ResendAdminOtpUseCase implements IResendAdminOtpUseCase {
    constructor() { }

    async execute(dto: ResendAdminOtpDTO): Promise<any> {
        try {

            const { token } = dto
            console.log('the token is', token);


            const key = `admin.otp:${token}`
            const data = await redisClient.get(key)

            console.log('the data is ', data);

            if (!data) {
                throw new Error(ErrorMessage.OTP_EXPIRED)
            }

            const parsed = JSON.parse(data)

            const newOtp = generateOTP()

            await redisClient.setex(
                key,
                3 * 60,
                JSON.stringify({
                    ...parsed,
                    otp: newOtp
                })
            )

            await sendOtpEmail(parsed.email, newOtp)

            console.log(newOtp);


            return {
                message: 'Resend OTP successfully'
            }

        } catch (error) {
            throw error
        }
    }
}