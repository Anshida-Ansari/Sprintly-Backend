import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ListCompanyUseCase } from "../../../application/usecases/superadmin/implementation/list.companies.usecase";
import type { IGetDetailPageUseCase } from "../../../application/usecases/superadmin/interface/get.detailpage.interface";
import type { IUpdateStatusInterface } from "../../../application/usecases/superadmin/interface/update.status.interface";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { SUPERADMIN_TYPES } from "../../../infrastructure/di/types/superadmin/superadmin.types";

@injectable()
export class SuperAdminController {
    constructor(
        @inject(SUPERADMIN_TYPES.IListCompanyUseCase)
        private _listCompanyUseCase: ListCompanyUseCase,
        @inject(SUPERADMIN_TYPES.IUpdateStatusInterface)
        private _updateStatusUseCase: IUpdateStatusInterface,
        @inject(SUPERADMIN_TYPES.IGetDetailPageUseCase)
        private _getDetailPageUseCase: IGetDetailPageUseCase
    ) { }

    async listCompanies(req: Request, res: Response, next: NextFunction) {
        try {

            const { page, limit, search } = req.query

            const query = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: search ? String(search) : ""
            }

            const response = await this._listCompanyUseCase.execute(query)
            return res.status(SuccessStatus.OK).json({

                success: true,
                ...response
            })
        } catch (error) {
            next(error)
        }
    }
    async updateStatus(req: Request, res: Response,next: NextFunction) {
        try {

            const { companyId } = req.params
            const { status } = req.body

            const result = await this._updateStatusUseCase.execute(companyId, status)

            res.status(SuccessStatus.OK).json({
                success: true,
                message: result.message
            })


        } catch (error) {
            next(error)
        }
    }
    async getDetailPage(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.params

            const company = await this._getDetailPageUseCase.execute(companyId)



            return res.status(SuccessStatus.OK).json({
                success: true,
                data: company
            })

        } catch (error) {

            next(error)

        }
    }
}