import { inject, injectable } from "inversify";
import { hash } from "argon2";
import { ISetPassWordUseCase } from "../interface/set.password.interface";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { validationError } from "../../../../shared/utils/error-handling/errors/validation.error";
import { ConflictError } from "../../../../shared/utils/error-handling/errors/conflict.error";


@injectable()
export class SetPasswrodUseCase implements ISetPassWordUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository
    ) { }

    async execute(token: string, password: string, confirmPassword: string): Promise<{ message: string; }> {

        const key = `member.invite:${token}`
        const inviteData = await redisClient.get(key)


        if (!inviteData) {
            throw new NotFoundError(ErrorMessage.INVITATION_EXPIRED_OR_INVALID)
        }

        if (password !== confirmPassword) {
            throw new validationError(ErrorMessage.PASSWORDS_DO_NOT_MATCH)
        }

        const { name, email, companyId, adminId } = JSON.parse(inviteData)

        const existingUser = await this._userRepository.findByEmail(email)
        if (existingUser) {
            throw new ConflictError(ErrorMessage.EMAIL_ALREADY_EXISTS)
        }

        const hashedPassword = await hash(password)

        await this._userRepository.create({
            name,
            email,
            companyId,
            adminId,
            password: hashedPassword,
            role: Role.DEVELOPERS
        })

        await redisClient.del(key)

        return {
            message: 'Password set successfully'
        }


    }
}