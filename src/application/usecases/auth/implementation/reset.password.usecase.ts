import { inject, injectable } from "inversify";
import { UserEntity } from "../../../../domain/entities/user.entities";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { SuccessMessage } from "../../../../domain/enum/messages/success.message.enum";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { validationError } from "../../../../shared/utils/error-handling/errors/validation.error";
import type { ResetPasswordDTO } from "../../../dtos/auth/reset.password.dto";
import type { IResetPasswordUseCase } from "../interface/reset.password.interface";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUseCase{
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository:IUserRepository
    ){}

    async execute({email,newPassword,confirmPassword}: ResetPasswordDTO): Promise<{ message: string; }> {
       
            if(newPassword !== confirmPassword){
                throw new validationError(ErrorMessage.PASSWORDS_DO_NOT_MATCH)
            }

            const user = await this._userRepository.findByEmail(email)
            if(!user){
                throw new NotFoundError(ErrorMessage.USER_NOT_FOUND)
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
      
    }
}