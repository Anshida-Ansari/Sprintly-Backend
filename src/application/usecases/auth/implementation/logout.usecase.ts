import { injectable } from "inversify";
import { ILogoutUseCase } from "../interface/logout.interface";
import { LogoutDTO } from "../../../dtos/auth/logout.register.dto";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
    constructor() { }

    async execute(dto: LogoutDTO): Promise<void> {
        try {
            const { refreshToken } = dto
            if (!refreshToken) {
                throw new Error(ErrorMessage.REFRESH_TOKEN_REQUIRED)
            }

            await redisClient.del(`refresh:${refreshToken}`)
            
        } catch (error) {
            throw error
        }
    }
}