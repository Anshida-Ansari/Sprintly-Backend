import { inject, injectable } from "inversify";
import { IRefreshUseCase } from "../interface/refresh.interface";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { RefreshResult } from "src/domain/types/auth/refresh.result.types";
import { generateAccessToken, verifyToken } from "src/shared/utils/jwt.util";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { UserStatus } from "src/domain/enum/status.enum";

@injectable()
export class RefreshUseCase implements IRefreshUseCase{
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute(refreshToken: string): Promise<RefreshResult> {

        try {
            if(!refreshToken) throw new Error('Refresh token missing')

        const decoded: any = verifyToken(refreshToken,"refresh")
        if(!decoded) throw new Error('Invalid or expired refresh token')

        const storedToken = await redisClient.get(`refresh:${decoded.email}`)
        if(!storedToken || storedToken !== refreshToken){
            throw new Error('Refresh token expired or revoked')
        }

        const user = await this._userRepository.findByEmail(decoded.email)
        if(!user) throw new Error(ErrorMessage.USER_NOT_FOUND)


        if(user.status === UserStatus.BLOCK){
            throw new Error(ErrorMessage.ADMIN_BLOCKED)
        }

        const newAccessToken = generateAccessToken({
            id:user.id?.toString(),
            email:user.email,
            role:user.role
        })
        

        return{
            accessToken:newAccessToken,
            message:'Access tocken refreshed successfully'
        }
        } catch (error) {

            throw error
        }
    }
}