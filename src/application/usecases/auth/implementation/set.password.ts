import { inject, injectable } from "inversify";
import {  ISetPassWordUseCase } from "../interface/set.password.interface";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { hash } from "argon2";
import { dot } from "node:test/reporters";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { Role } from "src/domain/enum/role.enum";

@injectable()
export class SetPasswrodUseCase implements ISetPassWordUseCase{
    constructor(
        @inject(USER_TYPES.UserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute(token: string, password: string): Promise<{ message: string; }> {
        try {
            const key = `members.invite${token}`
            const inviteData = await redisClient.get(key)

            if(!inviteData){
                throw new Error(ErrorMessage.INVITATION_EXPIRED_OR_INVALID)
            }

            const {name,email,companyId} = JSON.parse(inviteData)

            const hashedPassword = await hash(password)

            await this._userRepository.create({
                name,
                email,
                companyId,
                password:hashedPassword,
                role:Role.DEVELOPERS
            })

            await redisClient.del(key)

            return {
                message:'Password set successfully'
            }

        

        } catch (error) {
            throw error
        }
    }
}