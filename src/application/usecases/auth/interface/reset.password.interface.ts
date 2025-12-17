import { ResetPasswordDTO } from "../../../../application/dtos/auth/reset.password.dto";

export interface IResetPasswordUseCase{
    execute(dto:ResetPasswordDTO):Promise<{
        message: string
    }>
}