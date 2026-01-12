import { injectable } from "inversify";

import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { generateOTP } from "@shared/utils/otp.generate.util";
import { sendOtpEmail } from "@shared/utils/send.otp.util";
import { validationError } from "@shared/utils/error-handling/errors/validation.error";

import type { ResendAdminOtpDTO } from "@application/dtos/auth/resend.otp.dto";
import type { IResendAdminOtpUseCase } from "@application/usecases/auth/interface/resend.register.otp.interface";

@injectable()
export class ResendAdminOtpUseCase implements IResendAdminOtpUseCase {

	async execute(dto: ResendAdminOtpDTO): Promise<any> {
		const { token, email } = dto;

		let key = "";
		if (token) {
			key = `admin.otp:${token}`;
		} else if (email) {
			key = `forgot-otp:${email}`;
		} else {
			throw new validationError("Token or email is required");
		}

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

		await sendOtpEmail(parsed.email || (email as string), newOtp);

		console.log(newOtp);

		return {
			message: "Resend OTP successfully",
		};
	}
}
