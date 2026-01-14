import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ICreateUserstoryUsecase } from "../../../application/usecases/userstory/interface/create.userstory.interface";
import type { IEditUserstoryUseCase } from "../../../application/usecases/userstory/interface/edit.usertory.interface";
import type { IListUserstoryUseCase } from "../../../application/usecases/userstory/interface/list.userstory.interface";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { USERSTORY_TYPE } from "../../../infrastructure/di/types/userstory/userstory";
import { IAssignUserStoriesToSprintUseCase } from "@application/usecases/userstory/interface/assign.userstory.to.sprints.interface";
import { IUpdateStatusOfUserStoryInterface } from "@application/usecases/userstory/interface/update.userstory.status.interface";
import { Role } from "@domain/enum/role.enum";

@injectable()
export class UserstoryController {
    constructor(
        @inject(USERSTORY_TYPE.ICreateUserstoryUsecase)
        private _createUserstoryUseCase: ICreateUserstoryUsecase,
        @inject(USERSTORY_TYPE.IEditUserstoryUseCase)
        private _editUserstoryUserCaase: IEditUserstoryUseCase,
        @inject(USERSTORY_TYPE.IListUserstoryUseCase)
        private _listUserstoryUseCase: IListUserstoryUseCase,
        @inject(USERSTORY_TYPE.IAssignUserStoriesToSprintUseCase)
        private _assignUserstoryToSprints: IAssignUserStoriesToSprintUseCase,
        @inject(USERSTORY_TYPE.IUpdateStatusOfUserStoryInterface)
        private _updateStatusofUserStory: IUpdateStatusOfUserStoryInterface
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
    async assigningToMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const companyId = req.user.companyId
            const { projectId } = req.params

            const result = await this._assignUserstoryToSprints.execute(req.body, companyId, projectId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                ...result
            })

        } catch (error) {
            next(error)
        }
    }
    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("PARAM FROM URL:", req.params); 
        console.log("USER FROM TOKEN:", req.user.companyId);

            const { companyId, role } = req.user
            const { userstoryId } = req.params
            const { status } = req.body

            const result = await this._updateStatusofUserStory.execute(companyId, userstoryId , status, role as Role)

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: "User story status updated successfully",
                data: result
            });


        } catch (error) {

            next(error)

        }
    }

}