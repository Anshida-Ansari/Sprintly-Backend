import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICreateSprintUseCase } from "src/application/usecases/sprints/interface/create.sprint.interface";
import { IListSprintsUseCase } from "src/application/usecases/sprints/interface/list.sprints";
import { SprintStatus } from "src/domain/enum/sprints/sprints.status";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";

@injectable()
export class SprintController {
    constructor(
        @inject(SPRINTS_TYPE.ICreateSprintUseCase)
        private _createSprintsUseCase: ICreateSprintUseCase,
        @inject(SPRINTS_TYPE.IListSprintsUseCase)
        private _listSprintsUseCase: IListSprintsUseCase
    ) { }

    async createSprints(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params

            const result = await this._createSprintsUseCase.execute(req.body, projectId, companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Sprint Created Successfully',
                data: result
            })

        } catch (error) {

            next(error)

        }
    }

    async listSprints(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { projectId } = req.params

            const { page, limit, search, status } = req.query

            const query = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: search ? String(search) : "",
                status: status ? (status as SprintStatus) : undefined
            }

            const result = await this._listSprintsUseCase.execute(query, companyId, projectId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                ...result
            })



        } catch (error) {
            next(error)
        }
    }
}