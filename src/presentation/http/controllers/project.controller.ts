import { log } from "node:console";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ICreateProjectUseCase } from "src/application/usecases/projects/interface/create.project.interface";
import type { IEditProjectUsecase } from "src/application/usecases/projects/interface/edit.project.interface";
import type { IGetDetailProjectUseCase } from "src/application/usecases/projects/interface/get.detail.project.interface";
import type { IListProjectUseCase } from "src/application/usecases/projects/interface/list.project.interface";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";
import { SuccessStatus } from "src/domain/enum/status-codes/success.status.enum";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";

@injectable()
export class ProjectController {
    constructor(
        @inject(PROJECT_TYPE.CreateProjectUseCase)
        private _createProjectUseCase: ICreateProjectUseCase,
        @inject(PROJECT_TYPE.IListProjectUseCase)
        private _listProjectUseCase: IListProjectUseCase,
        @inject(PROJECT_TYPE.IEditProjectUsecase)
        private _editProjectUseCase: IEditProjectUsecase,
        @inject(PROJECT_TYPE.IGetDetailProjectUseCase)
        private _projectdetailUseCase: IGetDetailProjectUseCase

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

            const response = await this._listProjectUseCase.execute(query, companyId)
            return res.status(SuccessStatus.OK).json({

                success: true,
                ...response
            })
        } catch (error) {
            next(error)

        }
    }
    async editProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: adminId, companyId } = req.user
            const { projectId } = req.params
            console.log('projectId', projectId);

            const dto = req.body

            const result = await this._editProjectUseCase.execute(projectId, dto, adminId, companyId)
            console.log(result);


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Project Updated Successfully',
                data: result
            })

        } catch (error) {
            next(error)
        }

    }

    async getProjectDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.user
            const { projectId } = req.params

            if (!projectId) {
                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    message: "Project ID is required"
                })
            }

            const result = await this._projectdetailUseCase.execute(companyId, projectId)

            return res.status(SuccessStatus.OK).json({
                success: true,
                data: result
            })



        } catch (error) {
            next(error)
        }
    }
}