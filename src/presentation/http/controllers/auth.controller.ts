import { ServerErrorStatus } from "../../../domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILoginUseCase } from "../../../application/usecases/auth/interface/login.interface";
import { IRefreshUseCase } from "../../../application/usecases/auth/interface/refresh.interface";
import { AUTH_TYPES } from "../../../infrastructure/di/types/auth/auth.types";
import { ClientErrorStatus } from "../../../domain/enum/status-codes/client.error.status.enum";
import { IRegisterAdminUseCase } from "../../../application/usecases/auth/interface/admin.register.interface";
import { IVerifyOtpUseCase } from "../../../application/usecases/auth/interface/verifyadmin.otp.interface";
import { ISetPassWordUseCase } from "../../../application/usecases/auth/interface/set.password.interface";
import { IForgotPasswordUseCase } from "../../../application/usecases/auth/interface/forgot.password.interface";
import { IResetPasswordUseCase } from "../../../application/usecases/auth/interface/reset.password.interface";
import { IResendAdminOtpUseCase } from "../../../application/usecases/auth/interface/resend.register.otp.interface";
import { ILogoutUseCase } from "../../../application/usecases/auth/interface/logout.interface";


@injectable()
export class AuthController {
    constructor(
        @inject(AUTH_TYPES.IRegisterAdminUseCase)
        private _registerAdminUseCase: IRegisterAdminUseCase,
        @inject(AUTH_TYPES.IVerifyOtpUseCase)
        private _verifyAdminUseCase: IVerifyOtpUseCase,
        @inject(AUTH_TYPES.ILoginUseCase)
        private _loginUseCase: ILoginUseCase,
        @inject(AUTH_TYPES.IRefreshUseCase)
        private _refreshUseCase: IRefreshUseCase,
        @inject(AUTH_TYPES.ISetPassWordUseCase)
        private _setPasswrodUseCase:ISetPassWordUseCase,
        @inject(AUTH_TYPES.IForgotPasswordUseCase)
        private _forgotPasswordUseCase:IForgotPasswordUseCase,
        @inject(AUTH_TYPES.IResetPasswordUseCase)
        private _resetPassWordUseCase:IResetPasswordUseCase,
        @inject(AUTH_TYPES.IResendAdminOtpUseCase)
        private _resendAdminOtpUseCase:IResendAdminOtpUseCase,
        @inject(AUTH_TYPES.ILogoutUseCase)
        private _logoutUseCase:ILogoutUseCase
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
    async login(req: Request, res: Response) {

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

    async refreshToken(req: Request, res: Response) {
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
    async setPassword(req:Request, res:Response){
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
    async forgotPasswrod(req:Request,res:Response){
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
    async resetPassword(req:Request,res:Response){
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

    async resendOtp(req:Request,res:Response){
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
    async logout(req:Request,res:Response){
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