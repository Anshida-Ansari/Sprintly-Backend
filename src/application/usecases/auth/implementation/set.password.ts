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
import { threadId } from "worker_threads";
import { log } from "console";
    
@injectable()
export class SetPasswrodUseCase implements ISetPassWordUseCase{
    constructor(
        @inject(USER_TYPES.UserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute(token: string, password: string , confirmPassword: string): Promise<{ message: string; }> {
        try {
            console.log('taking the data');
            
            const key = `member.invite:${token}`
            const inviteData = await redisClient.get(key)
            console.log('the invitedData is here',inviteData);
            

            if(!inviteData){
                throw new Error(ErrorMessage.INVITATION_EXPIRED_OR_INVALID)
            }

            if(password !== confirmPassword){
                throw new Error(ErrorMessage.PASSWORDS_DO_NOT_MATCH)
            }

            
            

            const {name,email,companyId,adminId} = JSON.parse(inviteData)

            const existingUser = await this._userRepository.findByEmail(email)
            if(existingUser){
                throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
            }

            const hashedPassword = await hash(password)

            await this._userRepository.create({
                name,
                email,
                companyId,
                adminId,
                password:hashedPassword,    
                role:Role.DEVELOPERS
            })

            await redisClient.del(key)

            return {
                message:'Password set successfully'
            }

        

        } catch (error) {
            console.log('there is an error',error);
            
            throw error
        }
    }
}