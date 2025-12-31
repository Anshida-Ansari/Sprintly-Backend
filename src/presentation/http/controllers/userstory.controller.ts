import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ICreateUserstoryUsecase } from "../../../application/usecases/userstory/interface/create.userstory.interface";
import type { IEditUserstoryUseCase } from "../../../application/usecases/userstory/interface/edit.usertory.interface";
import type { IListUserstoryUseCase } from "../../../application/usecases/userstory/interface/list.userstory.interface";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { USERSTORY_TYPE } from "../../../infrastructure/di/types/userstory/userstory";

@injectable()
export class UserstoryController {
    constructor(
        @inject(USERSTORY_TYPE.ICreateUserstoryUsecase)
        private _createUserstoryUseCase: ICreateUserstoryUsecase,
        @inject(USERSTORY_TYPE.IEditUserstoryUseCase)
        private _editUserstoryUserCaase: IEditUserstoryUseCase,
        @inject(USERSTORY_TYPE.IListUserstoryUseCase)
        private _listUserstoryUseCase: IListUserstoryUseCase
    ) { }

    async createUserstory(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params

            const result = await this._createUserstoryUseCase.execute(req.body, companyId, projectId)


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Userstory created Successfully',
                data: result
            })


        } catch (error) {
            next(error)
        }
    }

    async editUserstory(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params
            const { userstoryId } = req.params

            const result = await this._editUserstoryUserCaase.execute(req.body, companyId, projectId, userstoryId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Userstory Updated Successfully',
                data: result
            })

        } catch (error) {
            next(error)
        }
    }
    async listUserstory(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params

            const { page, limit, search, sprintId, status } = req.query

            const query = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: search ? String(search) : "",
                sprintId: sprintId ? String(sprintId) : undefined,
                status: status ? String(status) : undefined
            }


            const result = await this._listUserstoryUseCase.execute(query, companyId, projectId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                ...result
            })

        } catch (error) {
            next(error)
        }
    }
}