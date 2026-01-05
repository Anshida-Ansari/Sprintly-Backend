import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICreateSprintUseCase } from "src/application/usecases/sprints/interface/create.sprint.interface";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";

@injectable()
export class SprintController {
    constructor(
        @inject(SPRINTS_TYPE.ICreateSprintUseCase)
        private _createSprintsUseCase: ICreateSprintUseCase
    ) { }

    async createSprints(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params

            const result = await this._createSprintsUseCase.execute(req.body,projectId,companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Sprint Created Successfully',
                data: result
            })

        } catch (error) {

            next(error)

        }
    }
}