
export const AUTH_TYPES = {
	userModel: Symbol.for("UserModel"),
	CompanyModel: Symbol.for("CompanyModel"),
	//controllers
	AuthController: Symbol.for("AuthController"),

	//interfaces

	//UseCases
	IRegisterAdminUseCase: Symbol.for("IRegisterAdminUseCase"),
	ILoginUseCase: Symbol.for("ILoginUseCase"),
	IVerifyOtpUseCase: Symbol.for("IVerifyOtpUseCase"),
	IRefreshUseCase: Symbol.for("IRefreshUseCase"),
	ISetPassWordUseCase: Symbol.for("ISetPassWordUseCase"),
	IForgotPasswordUseCase: Symbol.for("IForgotPasswordUseCase"),
	IResetPasswordUseCase: Symbol.for("IResetPasswordUseCase"),
	IVerifyForgotPasswordOtpUseCase: Symbol.for("IVerifyForgotPasswordOtpUseCase"),
	IResendAdminOtpUseCase: Symbol.for("IResendAdminOtpUseCase"),
	ILogoutUseCase: Symbol.for("ILogoutUseCase"),

	//Providers
};
