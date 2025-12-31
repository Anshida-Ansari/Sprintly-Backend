import e, { type NextFunction, type Request, type Response } from "express";
import { inject, injectable } from "inversify";
import env from "../../../infrastructure/providers/env/env.validation";
import type { IRegisterAdminUseCase } from "../../../application/usecases/auth/interface/admin.register.interface";
import type { IForgotPasswordUseCase } from "../../../application/usecases/auth/interface/forgot.password.interface";
import type { ILoginUseCase } from "../../../application/usecases/auth/interface/login.interface";
import type { ILogoutUseCase } from "../../../application/usecases/auth/interface/logout.interface";
import type { IRefreshUseCase } from "../../../application/usecases/auth/interface/refresh.interface";
import type { IResendAdminOtpUseCase } from "../../../application/usecases/auth/interface/resend.register.otp.interface";
import type { IResetPasswordUseCase } from "../../../application/usecases/auth/interface/reset.password.interface";
import type { ISetPassWordUseCase } from "../../../application/usecases/auth/interface/set.password.interface";
import type { IVerifyOtpUseCase } from "../../../application/usecases/auth/interface/verifyadmin.otp.interface";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { AUTH_TYPES } from "../../../infrastructure/di/types/auth/auth.types";


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
        private _setPasswrodUseCase: ISetPassWordUseCase,
        @inject(AUTH_TYPES.IForgotPasswordUseCase)
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        @inject(AUTH_TYPES.IResetPasswordUseCase)
        private _resetPassWordUseCase: IResetPasswordUseCase,
        @inject(AUTH_TYPES.IResendAdminOtpUseCase)
        private _resendAdminOtpUseCase: IResendAdminOtpUseCase,
        @inject(AUTH_TYPES.ILogoutUseCase)
        private _logoutUseCase: ILogoutUseCase
    ) { }


    async register(req: Request, res: Response, next: NextFunction) {

        try {
            const admin = await this._registerAdminUseCase.execute(req.body)

            return res.status(SuccessStatus.OK).json({
                message: SuccessStatus.CREATED,
                data: admin
            })

        } catch (error) {
            next(error)
        }

    }

    async verifyOTP(req: Request, res: Response, next: NextFunction) {
        try {

            const result = await this._verifyAdminUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                message: 'Admin registerd Successfully',
                data: {
                    user: result.user
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {

        try {

            const result = await this._loginUseCase.execute(req.body)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: env.REFRESH_TOKEN_MAX_AGE

            })


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message,
                data: {
                    accessToken: result.accessToken,
                    role: result.user?.role,
                    user: result.user
                }
            })


        } catch (error) {
            next(error)

        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {

            const refreshToken = req.cookies?.refreshToken
            const result = await this._refreshUseCase.execute(refreshToken)

            return res.status(SuccessStatus.OK).json({
                message: result.message,
                data: {
                    accessToken: result.accessToken
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async setPassword(req: Request, res: Response, next: NextFunction) {
        try {


            const { token, password, confirmPassword } = req.body

            const response = await this._setPasswrodUseCase.execute(token, password, confirmPassword)

            return res.status(SuccessStatus.CREATED).json({
                success: true,
                message: response.message
            })




        } catch (error) {
            next(error)
        }
    }
    async forgotPasswrod(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._forgotPasswordUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message
            })

        } catch (error) {
            next(error)
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._resetPassWordUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message
            })
        } catch (error) {
            next(error)
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._resendAdminOtpUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message
            })
        } catch (error: any) {
            next(error)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken
            const result = await this._logoutUseCase.execute(refreshToken)

            res.clearCookie(refreshToken)

            res.json(result)

        } catch (error) {
            next(error)
        }
    }
}