import { injectable } from "inversify";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { verifyToken } from "@shared/utils/jwt.util";
import { validationError } from "@shared/utils/error-handling/errors/validation.error";

import type { LogoutDTO } from "@application/dtos/auth/logout.register.dto";
import type { ILogoutUseCase } from "@application/usecases/auth/interface/logout.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {

	async execute(dto: LogoutDTO): Promise<void> {
			const { refreshToken } = dto;
			if (!refreshToken) {
				throw new validationError(ErrorMessage.REFRESH_TOKEN_REQUIRED);
			}

			const decoded = verifyToken(refreshToken, "refresh") as { email: string };
			if (decoded?.email) {
				await redisClient.del(`refresh:${decoded.email}`);
			}
	}
}
