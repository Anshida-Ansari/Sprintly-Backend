import { inject, injectable } from "inversify";
import { IRefreshUseCase } from "../interface/refresh.interface";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { RefreshResult } from "../../../../domain/types/auth/refresh.result.types";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { UserStatus } from "../../../../domain/enum/status.enum";
import { generateAccessToken, verifyToken } from "../../../../shared/utils/jwt.util";
import { validationError } from "../../../../shared/utils/error-handling/errors/validation.error";
import { Unauthorized } from "../../../../shared/utils/error-handling/errors/unauthorized.error";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { ForbiddenError } from "../../../../shared/utils/error-handling/errors/forbidden.error";

@injectable()
export class RefreshUseCase implements IRefreshUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<RefreshResult> {


        if (!refreshToken) throw new validationError('Refresh token missing')

        const decoded: any = verifyToken(refreshToken, "refresh")
        if (!decoded) throw new Unauthorized('Invalid or expired refresh token')

        const storedToken = await redisClient.get(`refresh:${decoded.email}`)
        if (!storedToken || storedToken !== refreshToken) {
            throw new Unauthorized('Refresh token expired or revoked')
        }

        const user = await this._userRepository.findByEmail(decoded.email)
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND)


        if (user.status === UserStatus.BLOCK) {
            throw new ForbiddenError(ErrorMessage.ADMIN_BLOCKED)
        }

        const newAccessToken = generateAccessToken({
            id: user.id?.toString(),
            email: user.email,
            role: user.role
        })


        return {
            accessToken: newAccessToken,
            message: 'Access tocken refreshed successfully'
        }

    }
}