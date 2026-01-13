import type { NextFunction, Request, Response } from "express";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { inject, injectable } from "inversify";
import { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";

@injectable()
export class SubTaskController {
    constructor(
        @inject(SUBTASK_TYPE.ICreateSubTaskUseCase)
        private _createSubTaskUseCase: ICreateSubTaskUseCase
    ) { }

    async createSubTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.user
            const {userStoryId} = req.params

            const result = await this._createSubTaskUseCase.execute(req.body, companyId, userStoryId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Subtask created Successfully',
                data: result
            })

        } catch (error) {
            next(error)
        }
    }
}