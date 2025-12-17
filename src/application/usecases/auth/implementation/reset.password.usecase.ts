import { inject, injectable } from "inversify";
import { IResetPasswordUseCase } from "../interface/reset.password.interface";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { ResetPasswordDTO } from "src/application/dtos/auth/reset.password.dto";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { ErrorReply } from "redis";
import { UserEntity } from "src/domain/entities/user.entities";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUseCase{
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute({email,newPassword,confirmPassword}: ResetPasswordDTO): Promise<{ message: string; }> {
        try {
            if(newPassword !== confirmPassword){
                throw new Error(ErrorMessage.PASSWORDS_DO_NOT_MATCH)
            }

            const user = await this._userRepository.findByEmail(email)
            if(!user){
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }

            const userEntity = UserEntity.create({
                id:user.id,
                name:user.name,
                email:user.email,
                password:newPassword,
                role:user.role,
                status:user.status,
                companyId:user.companyId,
                adminId:user.adminId

            })

            const hashedPassword = await userEntity.getHashedPassword()
            userEntity.setPassword(hashedPassword)

            await this._userRepository.updatePassword(user.id!,userEntity.password)
            return{
                message:SuccessMessage.PASSWORD_RESET
            }
        } catch (error) {
            throw error
            
        }
    }
}