import { ContainerModule } from "inversify";
import { RegisterAdminUseCase } from "src/application/usecases/auth/implementation/admin.register.usecase";
import { ForgotPasswordUseCase } from "src/application/usecases/auth/implementation/forgot.password.usecase";
import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";
import { LogoutUseCase } from "src/application/usecases/auth/implementation/logout.usecase";
import { RefreshUseCase } from "src/application/usecases/auth/implementation/refresh.usecase";
import { ResendAdminOtpUseCase } from "src/application/usecases/auth/implementation/resend.register.otp.ussecase";
import { ResetPasswordUsecase } from "src/application/usecases/auth/implementation/reset.password.usecase";
import { SetPasswrodUseCase } from "src/application/usecases/auth/implementation/set.password";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/implementation/verifyadmin.otp.usecase";
import type { IRegisterAdminUseCase } from "src/application/usecases/auth/interface/admin.register.interface";
import type { IForgotPasswordUseCase } from "src/application/usecases/auth/interface/forgot.password.interface";
import type { ILoginUseCase } from "src/application/usecases/auth/interface/login.interface";
import type { ILogoutUseCase } from "src/application/usecases/auth/interface/logout.interface";
import type { IRefreshUseCase } from "src/application/usecases/auth/interface/refresh.interface";
import type { IResendAdminOtpUseCase } from "src/application/usecases/auth/interface/resend.register.otp.interface";
import type { IResetPasswordUseCase } from "src/application/usecases/auth/interface/reset.password.interface";
import type { ISetPassWordUseCase } from "src/application/usecases/auth/interface/set.password.interface";
import type { IVerifyOtpUseCase } from "src/application/usecases/auth/interface/verifyadmin.otp.interface";
import { AuthController } from "src/presentation/http/controllers/auth.controller";
import { AUTH_TYPES } from "../../types/auth/auth.types";
// import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";

export const AuthModule = new ContainerModule(({ bind }) => {
	bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController);

	//providers

	//usecases

	bind<IRegisterAdminUseCase>(AUTH_TYPES.IRegisterAdminUseCase).to(
		RegisterAdminUseCase,
	);
	bind<IVerifyOtpUseCase>(AUTH_TYPES.IVerifyOtpUseCase).to(
		VerifyAdminOtpUseCase,
	);
	bind<ILoginUseCase>(AUTH_TYPES.ILoginUseCase).to(LoginUseCase);
	bind<IRefreshUseCase>(AUTH_TYPES.IRefreshUseCase).to(RefreshUseCase);
	bind<ISetPassWordUseCase>(AUTH_TYPES.ISetPassWordUseCase).to(
		SetPasswrodUseCase,
	);
	bind<IForgotPasswordUseCase>(AUTH_TYPES.IForgotPasswordUseCase).to(
		ForgotPasswordUseCase,
	);
	bind<IResetPasswordUseCase>(AUTH_TYPES.IResetPasswordUseCase).to(
		ResetPasswordUsecase,
	);
	bind<IResendAdminOtpUseCase>(AUTH_TYPES.IResendAdminOtpUseCase).to(
		ResendAdminOtpUseCase,
	);
	bind<ILogoutUseCase>(AUTH_TYPES.ILogoutUseCase).to(LogoutUseCase);

	//controllers
});
