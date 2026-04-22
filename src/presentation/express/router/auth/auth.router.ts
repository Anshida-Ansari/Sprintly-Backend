import { AUTH_ROUTES } from "@shared/constants/auth.routes.constants";
import { Router } from "express";
import { AdminRegisterDTO } from "../../../../application/dtos/auth/admin.register.dto";
import { ForgotPasswordDTO } from "../../../../application/dtos/auth/forgot.password.dto";
import { LoginDTO } from "../../../../application/dtos/auth/login.dto";
import { LogoutDTO } from "../../../../application/dtos/auth/logout.register.dto";
import { ResendAdminOtpDTO } from "../../../../application/dtos/auth/resend.otp.dto";
import { ResetPasswordDTO } from "../../../../application/dtos/auth/reset.password.dto";
import { SetPasswordDTO } from "../../../../application/dtos/auth/set.password.dto";
import { VerifyOtpDTO } from "../../../../application/dtos/auth/verify.admin.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { AUTH_TYPES } from "../../../../infrastructure/di/types/auth/auth.types";
import type { AuthController } from "../../../http/controllers/auth.controller";
import type { AuthGuard } from "../../middleware/auth.guard";
import { validateDTO } from "../../middleware/validate.dto.middleware";

const router = Router();

const authController = container.get<AuthController>(AUTH_TYPES.AuthController);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	AUTH_ROUTES.REGISTER,
	validateDTO(AdminRegisterDTO),
	(req, res, next) => authController.register(req, res, next),
);
router.post(
	AUTH_ROUTES.VERIFY_OTP,
	validateDTO(VerifyOtpDTO),
	(req, res, next) => authController.verifyOTP(req, res, next),
);
router.post(AUTH_ROUTES.LOGIN, validateDTO(LoginDTO), (req, res, next) =>
	authController.login(req, res, next),
);
router.post(AUTH_ROUTES.REFRESH, (req, res, next) =>
	authController.refreshToken(req, res, next),
);
router.post(
	AUTH_ROUTES.SET_PASSWORD,
	validateDTO(SetPasswordDTO),
	(req, res, next) => authController.setPassword(req, res, next),
);
router.post(
	AUTH_ROUTES.FORGOT_PASSWORD,
	validateDTO(ForgotPasswordDTO),
	(req, res, next) => authController.forgotPasswrod(req, res, next),
);
router.post(AUTH_ROUTES.VERIFY_FORGOT_OTP, (req, res, next) =>
	authController.verifyForgotOTP(req, res, next),
);
router.post(
	AUTH_ROUTES.RESET_PASSWORD,
	validateDTO(ResetPasswordDTO),
	(req, res, next) => authController.resetPassword(req, res, next),
);
router.post(
	AUTH_ROUTES.RESEND_OTP,
	validateDTO(ResendAdminOtpDTO),
	(req, res, next) => authController.resendOtp(req, res, next),
);
router.post(AUTH_ROUTES.LOGOUT, validateDTO(LogoutDTO), (req, res, next) =>
	authController.logout(req, res, next),
);

router.get(
	AUTH_ROUTES.GET_ME,
	authGuard.authorize(["admin", "lead", "developers", "superadmin"]),
	(req, res, next) => authController.getMe(req, res, next),
);

export { router as authRouter };
