import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import type { IInviteMemberUseCase } from "../../../application/usecases/admin/interface/invite.member.interface";
import type { IListMembersUseCase } from "../../../application/usecases/admin/interface/list.members.interface";
import type { IVerifyInvitationUseCase } from "../../../application/usecases/admin/interface/verify.member.interface";
import { ErrorMessage } from "../../../domain/enum/messages/error.message.enum";
import { ClientErrorStatus } from "../../../domain/enum/status-codes/client.error.status.enum";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { ADMIN_TYPES } from "../../../infrastructure/di/types/admin/admin.types";

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

    async inviteMember(req: Request, res: Response, next: NextFunction) {
        try {

            console.log('reaching the controller');


            const companyId = req.user.companyId
            const adminId = req.user.id


            if (!companyId) {
                throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND)
            }

            if (!adminId) {
                throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND)
            }

            const result = await this._inviteMemberUseCase.execute(req.body, companyId, adminId)


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message,
                inviteLink: result.inviteLink
            })
        } catch (error) {

            next(error)

        }
    }

    async verifyInvitation(req: Request, res: Response, next: NextFunction) {
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

        } catch (error) {
            next(error)
        }
    }

    async listUsers(req: Request, res: Response, next: NextFunction) {
        try {

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
            next(error)

        }
    }



}