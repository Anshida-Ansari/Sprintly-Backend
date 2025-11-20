import { Router } from "express";
import { RegisterAdminUseCase } from "src/application/usecases/auth/admin.register.usecase";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/verifyadmin.otp.usecase";
import { userModel } from "src/infrastructure/db/models/user.model";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { AdminController } from "src/presentation/http/controllers/auth.controller";
import { IUser } from "src/infrastructure/db/interface/user.interface";


const router = Router()

const userRepositry = new UserRepository(userModel)
const registerAdminUseCase = new RegisterAdminUseCase(userRepositry)
const verifyAdminOtpUseCase = new VerifyAdminOtpUseCase(userRepositry)
const adminController = new AdminController(registerAdminUseCase,verifyAdminOtpUseCase)



router.post("/admin/register",(req,res)=>adminController.register(req,res))
router.post("/admin/verify-otp",(req,res)=>adminController.verifyOTP(req,res))


export default router