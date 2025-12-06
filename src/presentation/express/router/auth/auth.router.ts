import { Router } from "express"
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto"
import { ForgotPasswordDTO } from "src/application/dtos/auth/forgot.password.dto"
import { LoginDTO } from "src/application/dtos/auth/login.dto"
import { ResetPasswordDTO } from "src/application/dtos/auth/reset.password.dto"
import { SetPasswordDTO } from "src/application/dtos/auth/set.password.dto"
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto"
import { container } from "src/infrastructure/di/inversify.di"
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types"
import { AuthController } from "src/presentation/http/controllers/auth.controller"
import { validateDTO } from "src/shared/middleware/validate.dto.middlware"

const router = Router()

const authController = container.get<AuthController>(AUTH_TYPES.AuthController)

router.post('/admin/register', validateDTO(AdminRegisterDTO), (req, res) => authController.register(req, res))
router.post('/verify-otp', validateDTO(VerifyOtpDTO), (req, res) => authController.verifyOTP(req, res))
router.post('/login', validateDTO(LoginDTO), (req, res) => authController.Login(req, res))
router.post('/refresh', (req, res) => authController.RefreshToken(req, res))
router.post('/set-password',validateDTO(SetPasswordDTO),(req,res)=>authController.SetPassword(req,res))
router.post('/forgot-password',validateDTO(ForgotPasswordDTO),(req,res)=>authController.ForgotPasswrod(req,res))
router.post('/reset-password',validateDTO(ResetPasswordDTO),(req,res)=>authController.ResetPassword(req,res))


export { router as authRouter }