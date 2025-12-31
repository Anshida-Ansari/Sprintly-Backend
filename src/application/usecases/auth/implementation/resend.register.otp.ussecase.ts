import { injectable } from "inversify";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { generateOTP } from "../../../../shared/utils/otp.generate.util";
import { sendOtpEmail } from "../../../../shared/utils/send.otp.util";
import type { ResendAdminOtpDTO } from "../../../dtos/auth/resend.otp.dto";
import type { IResendAdminOtpUseCase } from "../interface/resend.register.otp.interface";

@injectable()
export class ResendAdminOtpUseCase implements IResendAdminOtpUseCase {
	constructor() {}

	async execute(dto: ResendAdminOtpDTO): Promise<any> {
		const { token } = dto;

		const key = `admin.otp:${token}`;
		const data = await redisClient.get(key);

		if (!data) {
			throw new NotFoundError(ErrorMessage.OTP_EXPIRED);
		}

		const parsed = JSON.parse(data);

		const newOtp = generateOTP();

		await redisClient.setex(
			key,
			3 * 60,
			JSON.stringify({
				...parsed,
				otp: newOtp,
			}),
		);

		await sendOtpEmail(parsed.email, newOtp);

		console.log(newOtp);

		return {
			message: "Resend OTP successfully",
		};
	}
}
