import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { error } from "console";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { RegisterAdminUseCase } from "src/application/usecases/auth/implementation/admin.register.usecase";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/implementation/verifyadmin.otp.usecase";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { Request, Response } from "express";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";
import { inject, injectable } from "inversify";
import { ILoginUseCase } from "src/application/usecases/auth/interface/login.interface";
import { IRefreshUseCase } from "src/application/usecases/auth/interface/refresh.interface";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { access } from "fs";
import { LoginUseCase } from "src/application/usecases/auth/implementation/login.usecase";
import { RefreshUseCase } from "src/application/usecases/auth/implementation/refresh.usecase";


@injectable()
export class AuthController{
    constructor(
        @inject(AUTH_TYPES.RegisterAdminUseCase)
        private _registerAdminUseCase:RegisterAdminUseCase,
        @inject(AUTH_TYPES.VerifyAdminOtpUseCase)
        private _verifyAdminUseCase:VerifyAdminOtpUseCase,
        @inject(AUTH_TYPES.LoginUseCase)    
        private  _loginUseCase: LoginUseCase,
        @inject(AUTH_TYPES.RefreshUseCase)
        private  _refreshUseCase: RefreshUseCase
    ){}


    async register(req:Request,res:Response){

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

    async verifyOTP(req:Request,res:Response){
        try {
        
            const result = await this._verifyAdminUseCase.execute(req.body)
            return res.status(SuccessStatus.OK).json({
                message:'Admin registerd Successfully',
                data:{
                    user:result.user
                }
            })

        } catch (error) {
           const err = error as Error
           return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    }
    async Login(req:Request,res:Response){
        
        try {

            console.log('I am at eteh controller right now ');
            
            
            const result = await this._loginUseCase.execute(req.body)
                        
            res.cookie("accessToken",result.accessToken,{
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
                data:{
                    accessToken:result.accessToken,
                    role: result.user?.role,  
                    user:result.user
                }
            })


            
        } catch (error) {
            console.log('it is not woriking',error);
            

            res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message: 'Login failed'
            })
            
        }
    }

    async RefreshToken(req:Request,res:Response){
        try {

            const refreshToken = req.cookies?.refreshToken
            const result = await this._refreshUseCase.execute(refreshToken)

            res.cookie("accessToken",result.accessToken,{
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE)

            })

            return res.status(SuccessStatus.OK).json({
                message: result.message,
                data:{
                    accessToken:result.accessToken
                }
            })
            
        } catch (error) {
            
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message: "Refresh Token failed"
            })
        }
    }
}