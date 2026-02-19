import { randomBytes } from "node:crypto";
import { hash } from "bcrypt";
import type { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import type { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { generateOTP } from "src/shared/utils/otp.generate.util";
import { sendOtpEmail } from "src/shared/utils/send.otp.util";

export class RegisterAdminUseCase {
	constructor(private userRepostitory: UserRepository) {}

	async execute(dto: AdminRegisterDTO) {
		try {
			const existing = await this.userRepostitory.findByEmail(dto.email);
			if (existing) throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS);

			const hashed = await hash(dto.password, 10);

			const otp = generateOTP();
			const token = randomBytes(32).toString("hex");

			await redisClient.setex(
				`admin.otp:${token}`,
				3 * 60,

				JSON.stringify({
					name: dto.name,
					email: dto.email,
					password: hashed,
					companyName: dto.companyName,
					otp,
				}),
			);

			await sendOtpEmail(dto.email, otp);
			console.log(otp);

			return {
				message: "OTP sent successfully",
				token: token,
			};
		} catch (error) {
			throw error;
		}
	}
}
