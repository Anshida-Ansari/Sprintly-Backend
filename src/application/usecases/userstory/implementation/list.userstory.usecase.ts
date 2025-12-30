import { inject, injectable } from "inversify";
import { IListUserstoryUseCase } from "../interface/list.userstory.interface";
import { USERSTORY_TYPE } from "src/infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "src/infrastructure/db/repository/interface/user.story.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "src/domain/enum/project/project.error.message";
import { ForbiddenError } from "src/shared/utils/error-handling/errors/forbidden.error";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";

@injectable()
export class ListUserstoryUseCase implements IListUserstoryUseCase {
    constructor(
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryrepository: IUserStroyRepository,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectreposioty: IProjectReposiotory
    ) { }

    async execute(query: { page: number; limit: number; search?: string; sprintId?: string; status?: string; }, companyId: string, projectId: string): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number; }> {
        const project = await this._projectreposioty.findById(projectId)
        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }
        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const { page, limit } = query

        const { data, total } = await this._userstoryrepository.listByProject({
            projectId,
            companyId,
            ...query
        })


        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

}