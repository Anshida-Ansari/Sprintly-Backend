import { ResetPasswordDTO } from "src/application/dtos/auth/reset.password.dto";
import { ForgotPasswordUseCase } from "src/application/usecases/auth/implementation/forgot.password.usecase";
import { LogoutUseCase } from "src/application/usecases/auth/implementation/logout.usecase";
import { ResendAdminOtpUseCase } from "src/application/usecases/auth/implementation/resend.register.otp.ussecase";
import { ResetPasswordUsecase } from "src/application/usecases/auth/implementation/reset.password.usecase";
import { SetPasswrodUseCase } from "src/application/usecases/auth/implementation/set.password";

export const AUTH_TYPES = {

userModel: Symbol.for('UserModel'),
CompanyModel: Symbol.for('CompanyModel'),
//controllers
AuthController: Symbol.for("AuthController"),

//interfaces

//UseCases
RegisterAdminUseCase: Symbol.for("RegisterAdminUseCase"),
LoginUseCase: Symbol.for("LoginUseCase"),
VerifyAdminOtpUseCase: Symbol.for("VerifyAdminOtpUseCase")  ,
RefreshUseCase: Symbol.for('RefreshUseCase'),
SetPasswrodUseCase: Symbol.for('SetPasswrodUseCase'),
ForgotPasswordUseCase: Symbol.for('ForgotPasswordUseCase'),
ResetPasswordUsecase: Symbol.for('ResetPasswordUsecase')    ,
ResendAdminOtpUseCase: Symbol.for('ResendAdminOtpUseCase'),
LogoutUseCase: Symbol.for('LogoutUseCase')

    
//Providers


}