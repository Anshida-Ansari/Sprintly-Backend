import { inject, injectable } from "inversify";
import { IListSprintsUseCase } from "../interface/list.sprints.interface";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";
import { ISprintReposiotry } from "src/infrastructure/db/repository/interface/sprints.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "src/domain/enum/project/project.error.message";
import { ForbiddenError } from "src/shared/utils/error-handling/errors/forbidden.error";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { SprintEntity } from "src/domain/entities/sptint.entities";

@injectable()
export class ListSprintsUseCase implements IListSprintsUseCase {
    constructor(
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _sprintsrepository: ISprintReposiotry,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectrepository: IProjectReposiotory
    ) { }

    async execute(query: { page: number; limit: number; search?: string; status?: string; }, companyId: string, projectId: string): Promise<{ data: SprintEntity[]; total: number; page: number; limit: number; totalPages: number; }> {

        const project = await this._projectrepository.findById(projectId)

        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }

        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }
        const { page, limit } = query
        const { data, total } = await this._sprintsrepository.listByProject({
            projectId,
            companyId,
            ...query
        })

        return{
            data,
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }


    }
}