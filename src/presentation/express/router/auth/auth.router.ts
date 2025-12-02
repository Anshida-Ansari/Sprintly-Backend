import { log } from "console"
import { Router } from "express"
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto"
import { LoginDTO } from "src/application/dtos/auth/login.dto"
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto"
import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase"
import { CompanyRepository } from "src/infrastructure/db/repository/implements/company.repositry"
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository"
import { container } from "src/infrastructure/di/inversify.di"
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types"
import { AuthController } from "src/presentation/http/controllers/auth.controller"
import { validateDTO } from "src/shared/middleware/validate.dto.middlware"

const router = Router()

const authController = container.get<AuthController>(AUTH_TYPES.AuthController)

router.post('/admin/register',validateDTO(AdminRegisterDTO),(req,res)=>authController.register(req, res))
router.post('/verify-otp',validateDTO(VerifyOtpDTO),(req,res)=>authController.verifyOTP(req,res))
router.post('/login',validateDTO(LoginDTO),(req,res)=>authController.Login(req,res))
router.post('/refresh',(req,res)=>authController.RefreshToken(req,res))



export default router;