import { injectable } from "inversify";
import { LogoutDTO } from "src/application/dtos/auth/logout.register.dto";
import { ILogoutUseCase } from "../interface/logout.interface";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";

@injectable()
export class LogoutUseCase implements ILogoutUseCase{
    constructor(){}

    async execute(dto: LogoutDTO): Promise<void> {
        try {
            const {refreshToken} = dto
            if(!refreshToken){
                throw new Error(ErrorMessage.REFRESH_TOKEN_REQUIRED)
            }

            await redisClient.del(`refresh:${refreshToken}`)

        } catch (error) {
            throw error
        }
    }
}