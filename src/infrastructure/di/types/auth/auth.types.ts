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
IRegisterAdminUseCase: Symbol.for("IRegisterAdminUseCase"),
ILoginUseCase: Symbol.for("ILoginUseCase"),
IVerifyOtpUseCase: Symbol.for("IVerifyOtpUseCase")  ,
IRefreshUseCase: Symbol.for('IRefreshUseCase'),
ISetPassWordUseCase: Symbol.for('ISetPassWordUseCase'),
IForgotPasswordUseCase: Symbol.for('IForgotPasswordUseCase'),
IResetPasswordUseCase: Symbol.for('IResetPasswordUseCase')    ,
IResendAdminOtpUseCase: Symbol.for('IResendAdminOtpUseCase'),
ILogoutUseCase: Symbol.for('ILogoutUseCase')

    
//Providers


}