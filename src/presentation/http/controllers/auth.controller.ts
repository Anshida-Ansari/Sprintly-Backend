import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { error } from "console";
import { AdminRegisterDTO } from "src/application/dtos/auth/admin.register.dto";
import { RegisterAdminUseCase } from "src/application/usecases/auth/admin.register.usecase";
import { VerifyAdminOtpUseCase } from "src/application/usecases/auth/verifyadmin.otp.usecase";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { Request, Response } from "express";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";

export class AdminController{
    constructor(
        private _registerAdminUseCase:RegisterAdminUseCase,
        private _verifyAdminUseCase:VerifyAdminOtpUseCase
    ){}


    async register(req:Request,res:Response){

        try {
            let dto = plainToInstance(AdminRegisterDTO,req.body)
            const errors = await validate(dto)

            if(errors.length>0){
                return res.status(400).json({
                    message:'Validation failed',
                    errors
                })
            }

            const admin = await this._registerAdminUseCase.execute(dto)

            return res.status(200).json({
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
            const dto = plainToInstance(VerifyOtpDTO,req.body)
            const errors = await validate(dto)

            if(errors.length>0){
                return res.status(400).json({
                    message:'Validation failed',
                    errors 
                })
            }

            const result = await this._verifyAdminUseCase.execute(dto)
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
}