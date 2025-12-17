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
import { ListUserUseCase } from "src/application/usecases/admin/implementation/list.members.usecase";
import { IInviteMemberUseCase } from "src/application/usecases/admin/interface/invite.member.interface";
import { IVerifyInvitationUseCase } from "src/application/usecases/admin/interface/verify.member.interface";
import { IListMembersUseCase } from "src/application/usecases/admin/interface/list.members.interface";

@injectable()
export class AdminController {
    constructor(

        @inject(ADMIN_TYPES.IInviteMemberUseCase)
        private _inviteMemberUseCase: IInviteMemberUseCase,
        @inject(ADMIN_TYPES.IVerifyInvitationUseCase)
        private _verifyInvitationUseCase: IVerifyInvitationUseCase,
        @inject(ADMIN_TYPES.IListMembersUseCase)
        private _listUserUseCase: IListMembersUseCase
    ) { }

    async inviteMember(req: Request, res: Response) {
        try {

            console.log('reaching the controller');


            const companyId = req.user.companyId
            const adminId = req.user.id


            if (!companyId) {
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    success: false,
                    message: ErrorMessage.COMPANY_NOT_FOUND
                })
            }

            if (!adminId) {
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    success: false,
                    message: ErrorMessage.ADMIN_NOT_FOUND
                })
            }

            const result = await this._inviteMemberUseCase.execute(req.body, companyId, adminId)


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message,
                inviteLink: result.inviteLink
            })
        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)

        }
    }

    async verifyInvitation(req: Request, res: Response) {
        try {

            console.log('reaching the verify');

            const { token } = req.body
            console.log(token);

            if (!token) {
                return res.status(ClientErrorStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Tocken is Expired"
                })
            }

            const data = await this._verifyInvitationUseCase.execute(token)

            return res.status(SuccessStatus.OK).json({
                success: true,
                data: data,
            })

        } catch (error: any) {
            return res.status(ClientErrorStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            console.log('hitting');
            
            const companyId = req.user.companyId;
            if (!companyId) {
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    success: false,
                    message: ErrorMessage.COMPANY_NOT_FOUND,
                });
            }
          
            const { page, limit, search } = req.query

            const query = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: search ? String(search) : ""
            }

            const response = await this._listUserUseCase.execute(companyId, query)
            return res.status(SuccessStatus.OK).json({
                success: true,
                ...response,
            })
        } catch (error: any) {
            console.error("Error in ListUsers:", error);
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to fetch members",
            })

        }
    }



}