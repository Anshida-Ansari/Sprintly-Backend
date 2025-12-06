import { inject, injectable } from "inversify";
import { InviteMemberUseCase } from "src/application/usecases/admin/implementation/invite.member.usecase";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { Request, Response } from "express";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { log } from "node:console";
import { VerifyInvitationUseCase } from "src/application/usecases/admin/implementation/verify.member.usecase";

@injectable()
export class AdminController{
    constructor(

        @inject(ADMIN_TYPES.InviteMemberUseCase)
        private _inviteMemberUseCase:InviteMemberUseCase,
        @inject(ADMIN_TYPES.VerifyInvitationUseCase)
        private _verifyInvitationUseCase:VerifyInvitationUseCase
    ){}

    async inviteMember(req:Request,res:Response){
        try {

            console.log('reaching the controller');
            

            const companyId = req.user.companyId
            const adminId = req.user.id
            

            if(!companyId){
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                   success:false,
                   message:ErrorMessage.COMPANY_NOT_FOUND
                })
            }
            
            if(!adminId){
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    success:false,
                    message:ErrorMessage.ADMIN_NOT_FOUND
                })
            }
            
            const result = await this._inviteMemberUseCase.execute(req.body,companyId,adminId)


            return res.status(SuccessStatus.OK).json({
                success:true,
                message:result.message,
                inviteLink:result.inviteLink
            })
        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
            
        }
    }

    async verifyInvitation(req:Request,res:Response){
        try {

            const token = req.query.token as string

            if(!token){
                return res.status(ClientErrorStatus.BAD_REQUEST).json({
                    success:false,
                    message:"Tocken is Expired"
                })
            }

            const data = await this._verifyInvitationUseCase.execute(token)

            return res.status(SuccessStatus.OK).json({
                success:true,
                message:'Token is required',
                data:data,
                redirectUrl:`https://sprintly.com/reset-password?token=${token}`
            })

        } catch (error) {
            return res.status(ClientErrorStatus.BAD_REQUEST).json({
                success:false,
                message:error
            })
        }
    }
    
    

}