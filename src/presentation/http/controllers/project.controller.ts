import { inject, injectable } from "inversify";
import { ICreateProjectUseCase } from "src/application/usecases/projects/interface/create.project.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { NextFunction, Request, Response } from "express";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { IListProjectUseCase } from "src/application/usecases/projects/interface/list.project.interface";

@injectable()
export class ProjectController {
    constructor(
        @inject(PROJECT_TYPE.CreateProjectUseCase)
        private _createProjectUseCase: ICreateProjectUseCase,
        @inject(PROJECT_TYPE.IListProjectUseCase)
        private _listProjectUseCase: IListProjectUseCase

    ) { }

    async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: adminId, companyId } = req.user

            const result = await this._createProjectUseCase.execute(
                req.body,
                adminId,
                companyId
            )

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Project created Successfully',
                data: result
            })

        } catch (error) {
            next(error)
        }
    }
    async listProject(req: Request, res: Response, next: NextFunction) {
        try {
            const companyId = req.user.companyId
            const { page, limit, search } = req.query
            const query = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: search ? String(search) : ""
            }

            const response = await this._listProjectUseCase.execute(query,companyId)
            return res.status(SuccessStatus.OK).json({

                success: true,
                ...response
            })
        } catch (error) {
            next(error)

        }
    }
}