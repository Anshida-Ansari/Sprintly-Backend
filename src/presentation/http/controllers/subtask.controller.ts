import type { NextFunction, Request, Response } from "express";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { inject, injectable } from "inversify";
import { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { IUpdateSubtaskStatusUseCase } from "@application/usecases/subtask/interface/update.subtask.status.interface";
import { Role } from "@domain/enum/role.enum";
import { IListSubtasksByStoryUseCase } from "@application/usecases/subtask/interface/list.subtask.interface";
import { IAssignSubtaskUseCase } from "@application/usecases/subtask/interface/assign.subtask.interface";
import { IDeleteSubtaskUseCase } from "@application/usecases/subtask/interface/delete.subtask.interface";

@injectable()
export class SubTaskController {
    constructor(
        @inject(SUBTASK_TYPE.ICreateSubTaskUseCase)
        private _createSubTaskUseCase: ICreateSubTaskUseCase,
        @inject(SUBTASK_TYPE.IUpdateSubtaskStatusUseCase)
        private _updateSubTaskUseCase: IUpdateSubtaskStatusUseCase,
        @inject(SUBTASK_TYPE.IListSubtasksByStoryUseCase)
        private _listSubtaskUseCase: IListSubtasksByStoryUseCase,
        @inject(SUBTASK_TYPE.IAssignSubtaskUseCase)
        private _assignSubtaskUseCase: IAssignSubtaskUseCase,
        @inject(SUBTASK_TYPE.IDeleteSubtaskUseCase)
        private _delteSubtaskUseCase: IDeleteSubtaskUseCase
    ) { }

    async createSubTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.user
            const { userStoryId } = req.params

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
    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId, role } = req.user
            const { subtaskId } = req.params
            const { status } = req.body

            const result = await this._updateSubTaskUseCase.execute(subtaskId, companyId, status, role as Role)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Subtask Updated  Successfully',
                data: result
            })

        } catch (error) {

            next(error)

        }
    }
    async listSubtask(req: Request, res: Response, next: NextFunction) {
        try {

            const { companyId } = req.user
            const { userStoryId } = req.params

            const result = await this._listSubtaskUseCase.execute(userStoryId, companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Subtasks is listed successfully',
                data: result
            })


        } catch (error) {

            next(error)

        }
    }

    async assignMembers(req: Request, res: Response, next: NextFunction){
        try {
            const {companyId} = req.user
            const {subtaskId} = req.params
            const {developerId} = req.body

            const result = await this._assignSubtaskUseCase.execute(subtaskId,developerId,companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Subtask is Assigned to developer',
                data: result
            })
            
        } catch (error) {
            next(error)
        }
    }
    async  deleteSubtask(req:Request, res:Response, next:NextFunction){
        try {
            const {companyId} = req.user
            const {subtaskId} = req.params

            const result = await this._delteSubtaskUseCase.execute(subtaskId,companyId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Subtask is deleted Successfully',
                data: result
            })

        } catch (error) {
            next(error)            
        }
    }
}