import { ForgotPasswordDTO } from "src/application/dtos/auth/forgot.password.dto";

export interface IForgotPasswordUseCase{
    execute(email:ForgotPasswordDTO):Promise<{
        message: string
    }>
}