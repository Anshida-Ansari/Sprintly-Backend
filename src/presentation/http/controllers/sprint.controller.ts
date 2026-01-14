import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ICreateSprintUseCase } from "@application/usecases/sprints/interface/create.sprint.interface";
import type { IEditSprintUseCase } from "@application/usecases/sprints/interface/edit.sprints.interface";
import type { IListSprintsUseCase } from "@application/usecases/sprints/interface/list.sprints.interface";
import type { SprintStatus } from "@domain/enum/sprints/sprints.status";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { IStartSprintUseCase } from "@application/usecases/sprints/interface/start.sprint.interface";

@injectable()
export class SprintController {
    constructor(
        @inject(SPRINTS_TYPE.ICreateSprintUseCase)
        private _createSprintsUseCase: ICreateSprintUseCase,
        @inject(SPRINTS_TYPE.IListSprintsUseCase)
        private _listSprintsUseCase: IListSprintsUseCase,
        @inject(SPRINTS_TYPE.IEditSprintUseCase)
        private _editSprintUseCase: IEditSprintUseCase,
        @inject(SPRINTS_TYPE.IStartSprintUseCase)
        private _startSprintUseCase: IStartSprintUseCase
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

    async editSprints(req: Request, res: Response, next: NextFunction) {

        try {

            const { companyId } = req.user
            console.log('teh companyId', companyId);

            const { projectId, sprintId } = req.params

            console.log('the projectId', projectId)
            console.log('the sprintId', sprintId)

            const result = await this._editSprintUseCase.execute(req.body, sprintId, projectId, companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Sprint edited  Successfully',
                data: result
            })

        } catch (error) {
            next(error)
        }
    }
    async startSprint(req: Request, res: Response, next: NextFunction){
        try {
            const {companyId} = req.user
            const {sprintId} = req.params

            const result = await this._startSprintUseCase.execute(companyId,sprintId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Start sprinted Successfully',
                data: result
            })
            
        } catch (error) {

            next(error)
            
        }
    }
}