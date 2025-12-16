import { ContainerModule } from "inversify";
import { AuthController } from "src/presentation/http/controllers/auth.controller";
import { AUTH_TYPES } from "../../types/auth/auth.types";
import { RegisterAdminUseCase } from "src/application/usecases/auth/implementation/admin.register.usecase";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/implementation/verifyadmin.otp.usecase";
import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";
import { RefreshUseCase } from "src/application/usecases/auth/implementation/refresh.usecase";
import { ILoginUseCase } from "src/application/usecases/auth/interface/login.interface";
import { IRefreshUseCase } from "src/application/usecases/auth/interface/refresh.interface";
import { ISetPassWordUseCase } from "src/application/usecases/auth/interface/set.password.interface";
import { SetPasswrodUseCase } from "src/application/usecases/auth/implementation/set.password";
import { IForgotPasswordUseCase } from "src/application/usecases/auth/interface/forgot.password.interface";
import { ForgotPasswordUseCase } from "src/application/usecases/auth/implementation/forgot.password.usecase";
import { ResetPasswordUsecase } from "src/application/usecases/auth/implementation/reset.password.usecase";
import { IResetPasswordUseCase } from "src/application/usecases/auth/interface/reset.password.interface";
import { IResendAdminOtpUseCase } from "src/application/usecases/auth/interface/resend.register.otp.interface";
import { ResendAdminOtpUseCase } from "src/application/usecases/auth/implementation/resend.register.otp.ussecase";
import { ILogoutUseCase } from "src/application/usecases/auth/interface/logout.interface";
import { LogoutUseCase } from "src/application/usecases/auth/implementation/logout.usecase";
// import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";

export const AuthModule = new ContainerModule(({bind})=>{

bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController)

//providers

//usecases

bind<RegisterAdminUseCase>(AUTH_TYPES.RegisterAdminUseCase).to(RegisterAdminUseCase)
bind<VerifyAdminOtpUseCase>(AUTH_TYPES.VerifyAdminOtpUseCase).to(VerifyAdminOtpUseCase)
bind<ILoginUseCase>(AUTH_TYPES.LoginUseCase).to(LoginUseCase)
bind<IRefreshUseCase>(AUTH_TYPES.RefreshUseCase).to(RefreshUseCase)
bind<ISetPassWordUseCase>(AUTH_TYPES.SetPasswrodUseCase).to(SetPasswrodUseCase)
bind<IForgotPasswordUseCase>(AUTH_TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase)
bind<IResetPasswordUseCase>(AUTH_TYPES.ResetPasswordUsecase).to(ResetPasswordUsecase)
bind<IResendAdminOtpUseCase>(AUTH_TYPES.ResendAdminOtpUseCase).to(ResendAdminOtpUseCase)
bind<ILogoutUseCase>(AUTH_TYPES.LogoutUseCase).to(LogoutUseCase)

//controllers


})