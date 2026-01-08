import { ContainerModule } from "inversify";
import { RegisterAdminUseCase } from "../../../../application/usecases/auth/implementation/admin.register.usecase";
import { ForgotPasswordUseCase } from "../../../../application/usecases/auth/implementation/forgot.password.usecase";
import { LoginUseCase } from "../../../../application/usecases/auth/implementation/login.usecase";
import { LogoutUseCase } from "../../../../application/usecases/auth/implementation/logout.usecase";
import { RefreshUseCase } from "../../../../application/usecases/auth/implementation/refresh.usecase";
import { ResendAdminOtpUseCase } from "../../../../application/usecases/auth/implementation/resend.register.otp.ussecase";
import { ResetPasswordUsecase } from "../../../../application/usecases/auth/implementation/reset.password.usecase";
import { SetPasswrodUseCase } from "../../../../application/usecases/auth/implementation/set.password";
import { VerifyAdminOtpUseCase } from "../../../../application/usecases/auth/implementation/verifyadmin.otp.usecase";
import type { IRegisterAdminUseCase } from "../../../../application/usecases/auth/interface/admin.register.interface";
import type { IForgotPasswordUseCase } from "../../../../application/usecases/auth/interface/forgot.password.interface";
import type { ILoginUseCase } from "../../../../application/usecases/auth/interface/login.interface";
import type { ILogoutUseCase } from "../../../../application/usecases/auth/interface/logout.interface";
import type { IVerifyForgotPasswordOtpUseCase } from "../../../../application/usecases/auth/interface/verify.forgot.otp.interface";
import { VerifyForgotPasswordOtpUseCase } from "../../../../application/usecases/auth/implementation/verify.forgot.otp.usecase";
import type { IRefreshUseCase } from "../../../../application/usecases/auth/interface/refresh.interface";
import type { IResendAdminOtpUseCase } from "../../../../application/usecases/auth/interface/resend.register.otp.interface";
import type { IResetPasswordUseCase } from "../../../../application/usecases/auth/interface/reset.password.interface";
import type { ISetPassWordUseCase } from "../../../../application/usecases/auth/interface/set.password.interface";
import type { IVerifyOtpUseCase } from "../../../../application/usecases/auth/interface/verifyadmin.otp.interface";
import { AuthController } from "../../../../presentation/http/controllers/auth.controller";
import { TokenBlacklistService } from "../../../providers/token.blacklist.service";
import { AUTH_TYPES } from "../../types/auth/auth.types";

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
	bind<IVerifyForgotPasswordOtpUseCase>(AUTH_TYPES.IVerifyForgotPasswordOtpUseCase).to(
		VerifyForgotPasswordOtpUseCase,
	);
	bind<ILogoutUseCase>(AUTH_TYPES.ILogoutUseCase).to(LogoutUseCase);

	//services
	bind<TokenBlacklistService>(AUTH_TYPES.TokenBlacklistService).to(TokenBlacklistService);

	//controllers
});
