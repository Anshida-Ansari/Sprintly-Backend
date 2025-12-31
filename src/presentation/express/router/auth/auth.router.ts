import { Router } from "express";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { ForgotPasswordDTO } from "src/application/dtos/auth/forgot.password.dto";
import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { LogoutDTO } from "src/application/dtos/auth/logout.register.dto";
import { ResendAdminOtpDTO } from "src/application/dtos/auth/resend.otp.dto";
import { ResetPasswordDTO } from "src/application/dtos/auth/reset.password.dto";
import { SetPasswordDTO } from "src/application/dtos/auth/set.password.dto";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";
import { container } from "src/infrastructure/di/inversify.di";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { validateDTO } from "src/presentation/express/middleware/validate.dto.middlware";
import type { AuthController } from "src/presentation/http/controllers/auth.controller";

const router = Router();

const authController = container.get<AuthController>(AUTH_TYPES.AuthController);

router.post(
	"/admin/register",
	validateDTO(AdminRegisterDTO),
	(req, res, next) => authController.register(req, res, next),
);
router.post("/verify-otp", validateDTO(VerifyOtpDTO), (req, res, next) =>
	authController.verifyOTP(req, res, next),
);
router.post("/login", validateDTO(LoginDTO), (req, res, next) =>
	authController.login(req, res, next),
);
router.post("/refresh", (req, res, next) =>
	authController.refreshToken(req, res, next),
);
router.post("/set-password", validateDTO(SetPasswordDTO), (req, res, next) =>
	authController.setPassword(req, res, next),
);
router.post(
	"/forgot-password",
	validateDTO(ForgotPasswordDTO),
	(req, res, next) => authController.forgotPasswrod(req, res, next),
);
router.post(
	"/reset-password",
	validateDTO(ResetPasswordDTO),
	(req, res, next) => authController.resetPassword(req, res, next),
);
router.post("/resend-otp", validateDTO(ResendAdminOtpDTO), (req, res, next) =>
	authController.resendOtp(req, res, next),
);
router.post("/logout", validateDTO(LogoutDTO), (req, res, next) =>
	authController.logout(req, res, next),
);

export { router as authRouter };
