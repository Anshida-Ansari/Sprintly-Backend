import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICreateUserstoryUsecase } from "src/application/usecases/userstory/interface/create.userstory.interface";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { USERSTORY_TYPE } from "src/infrastructure/di/types/userstory/userstory";

@injectable()
export class UserstoryController {
    constructor(
        @inject(USERSTORY_TYPE.ICreateUserstoryUsecase)
        private _createUserstoryUseCase: ICreateUserstoryUsecase
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
}