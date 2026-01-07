import { inject, injectable } from "inversify";
import { UserStatus } from "@domain/enum/status.enum";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { AUTH_TYPES } from "@infrastructure/di/types/auth/auth.types";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import type { TokenBlacklistService } from "@infrastructure/services/token.blacklist.service";
import type { IBlockUserUseCase } from "../interface/block.user.interface";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository,
        @inject(AUTH_TYPES.TokenBlacklistService)
        private _tokenBlacklistService: TokenBlacklistService
    ) { }

    async execute(userId: string, status: UserStatus): Promise<{ message: string }> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        }

        await this._userRepository.update(userId, { status });

        if (status === UserStatus.BLOCK) {
            await this._tokenBlacklistService.revokeUserRefreshTokens(user.email);
            console.log(`[BlockUserUseCase] User ${user.email} blocked and tokens revoked.`);
        }

        return {
            message: `User status updated to ${status}`
        };
    }
}
