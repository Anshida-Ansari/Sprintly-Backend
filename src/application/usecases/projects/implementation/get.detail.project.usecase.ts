import { inject, injectable } from "inversify";
import { IGetDetailProjectUseCase } from "../interface/get.detail.project.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "src/domain/enum/project/project.error.message";
import { ProjectStatus } from "src/domain/enum/project/project.status";
import { ForbiddenError } from "src/shared/utils/error-handling/errors/forbidden.error";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";

@injectable()
export class GetDetailProjectUseCase implements IGetDetailProjectUseCase {
    constructor(
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectrepsository: IProjectReposiotory
    ) { }

    async execute(companyId: string, proejctId: string): Promise<{ id: string; name: string; description?: string; status: ProjectStatus; startDate?: Date; endDate?: Date; gitRepoUrl?: string; members?: string[]; createdAt: Date; updatedAt: Date; }> {
        const project = await this._projectrepsository.findById(proejctId)

        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }
        console.log('project.companyId:', project.companyId.toString());
        console.log('user.companyId:', companyId.toString());

        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }
      


        return {
            id: project.id!,
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            gitRepoUrl: project.gitRepoUrl,
            members: project.members,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt!
        }
    }
}