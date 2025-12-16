import { ResendAdminOtpDTO } from "src/application/dtos/auth/resend.otp.dto";

export interface IResendAdminOtpUseCase{
    execute(dto:ResendAdminOtpDTO):Promise<any>

}