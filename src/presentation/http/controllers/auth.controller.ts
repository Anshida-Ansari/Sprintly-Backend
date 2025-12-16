import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { error, log } from "console";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { RegisterAdminUseCase } from "src/application/usecases/auth/implementation/admin.register.usecase";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/implementation/verifyadmin.otp.usecase";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { Request, response, Response } from "express";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";
import { inject, injectable } from "inversify";
import { ILoginUseCase } from "src/application/usecases/auth/interface/login.interface";
import { IRefreshUseCase } from "src/application/usecases/auth/interface/refresh.interface";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";
import { RefreshUseCase } from "src/application/usecases/auth/implementation/refresh.usecase";
import { SetPasswrodUseCase } from "src/application/usecases/auth/implementation/set.password";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { ForgotPasswordUseCase } from "src/application/usecases/auth/implementation/forgot.password.usecase";
import { ResetPasswordUsecase } from "src/application/usecases/auth/implementation/reset.password.usecase";
import { ResendAdminOtpUseCase } from "src/application/usecases/auth/implementation/resend.register.otp.ussecase";
import { LogoutUseCase } from "src/application/usecases/auth/implementation/logout.usecase";


@injectable()
export class AuthController {
    constructor(
        @inject(AUTH_TYPES.RegisterAdminUseCase)
        private _registerAdminUseCase: RegisterAdminUseCase,
        @inject(AUTH_TYPES.VerifyAdminOtpUseCase)
        private _verifyAdminUseCase: VerifyAdminOtpUseCase,
        @inject(AUTH_TYPES.LoginUseCase)
        private _loginUseCase: LoginUseCase,
        @inject(AUTH_TYPES.RefreshUseCase)
        private _refreshUseCase: RefreshUseCase,
        @inject(AUTH_TYPES.SetPasswrodUseCase)
        private _setPasswrodUseCase:SetPasswrodUseCase,
        @inject(AUTH_TYPES.ForgotPasswordUseCase)
        private _forgotPasswordUseCase:ForgotPasswordUseCase,
        @inject(AUTH_TYPES.ResetPasswordUsecase)
        private _resetPassWordUseCase:ResetPasswordUsecase,
        @inject(AUTH_TYPES.ResendAdminOtpUseCase)
        private _resendAdminOtpUseCase:ResendAdminOtpUseCase,
        @inject(AUTH_TYPES.LogoutUseCase)
        private _logoutUseCase:LogoutUseCase
    ) { }


    async register(req: Request, res: Response) {

        try {
            const admin = await this._registerAdminUseCase.execute(req.body)

            return res.status(SuccessStatus.OK).json({
                message: SuccessStatus.CREATED,
                data: admin
            })

        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }

    }

    async verifyOTP(req: Request, res: Response) {
        try {

            const result = await this._verifyAdminUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                message: 'Admin registerd Successfully',
                data: {
                    user: result.user
                }
            })

        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    }
    async Login(req: Request, res: Response) {

        try {

            console.log('I am at eteh controller right now ');


            const result = await this._loginUseCase.execute(req.body)

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE)
            })


            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE)
            })


            return res.status(SuccessStatus.OK).json({
                message: result.message,
                data: {
                    accessToken: result.accessToken,
                    role: result.user?.role,
                    user: result.user
                }
            })

            console.log('it is working ');
            



        } catch (error) {
            console.log('it is not woriking', error);


            res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'Login failed'
            })

        }
    }

    async RefreshToken(req: Request, res: Response) {
        try {

            const refreshToken = req.cookies?.refreshToken
            const result = await this._refreshUseCase.execute(refreshToken)

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE)

            })

            return res.status(SuccessStatus.OK).json({
                message: result.message,
                data: {
                    accessToken: result.accessToken
                }
            })

        } catch (error) {

            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Refresh Token failed"
            })
        }
    }
    async SetPassword(req:Request, res:Response){
        try {

            console.log('Reaching here')

            const {token,password,confirmPassword} = req.body
            
            const response = await this._setPasswrodUseCase.execute(token,password,confirmPassword)

            return res.status(SuccessStatus.CREATED).json({
                success: true,
                message:response.message
            })

            
            
            
        } catch (error) {

            console.log(error)
            return res.status(ClientErrorStatus.NOT_FOUND).json({
                success:false,
                message:error
            })
            
        }
    }
    async ForgotPasswrod(req:Request,res:Response){
        try {
            const result =await this._forgotPasswordUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success:true,
                message:result.message
            })

        } catch (error) {
            return res.status(ClientErrorStatus.NOT_FOUND).json({
                success:false,
                message:ServerErrorStatus.INTERNAL_SERVER_ERROR
            })
        }
    }
    async ResetPassword(req:Request,res:Response){
        try {
            const result =await this._resetPassWordUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success:true,
                message:result.message  
            })
        } catch (error) {
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:ServerErrorStatus.INTERNAL_SERVER_ERROR
            })
        }
    }

    async ResendOtp(req:Request,res:Response){
        try {
            const result = await this._resendAdminOtpUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success:true,
                message:result.message
            })
        } catch (error:any) {
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
        }
    }
    async Logout(req:Request,res:Response){
        try {
            const refreshToken = req.cookies.refreshToken
            const result = await this._logoutUseCase.execute(refreshToken)

            res.clearCookie(refreshToken)

            res.json(result)

        } catch (error:any) {
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
        }
    }
}