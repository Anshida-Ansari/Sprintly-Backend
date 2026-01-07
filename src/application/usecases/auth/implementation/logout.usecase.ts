import { injectable } from "inversify";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { validationError } from "@shared/utils/error-handling/errors/validation.error";

import type { LogoutDTO } from "@application/dtos/auth/logout.register.dto";
import type { ILogoutUseCase } from "@application/usecases/auth/interface/logout.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
	constructor() {}

	async execute(dto: LogoutDTO): Promise<void> {
		try {
			const { refreshToken } = dto;
			if (!refreshToken) {
				throw new validationError(ErrorMessage.REFRESH_TOKEN_REQUIRED);
			}

			await redisClient.del(`refresh:${refreshToken}`);
		} catch (error) {
			throw error;
		}
	}
}
