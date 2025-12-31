import { inject, injectable } from "inversify";
import type { CreateProjectDTO } from "../../../dtos/projects/create.project.dto";
import { ProjectEntity } from "../../../../domain/entities/project.entities";
import { ProjectErrorMessage } from "../../../../domain/enum/project/project.error.message";
import { ProjectStatus } from "../../../../domain/enum/project/project.status";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { ConflictError } from "../../../../shared/utils/error-handling/errors/conflict.error";
import type { ICreateProjectUseCase } from "../interface/create.project.interface";
import type { CreateProjectResponse } from "./res/create.project.response";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
    constructor(
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectRepsitory: IProjectReposiotory
    ) { }

    async execute(dto: CreateProjectDTO, adminId: string, companyId: string): Promise<CreateProjectResponse> {

        const exisitingProjeect = await this._projectRepsitory.findOne({
            name: dto.name,
            companyId
        })

        if (exisitingProjeect) {
            throw new ConflictError(ProjectErrorMessage.PROJECT_ALREADY_EXIST)
        }

        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        const Project = ProjectEntity.create({
            name: dto.name,
            description: dto.description,
            startDate,
            endDate,
            createdBy: adminId,
            companyId,
            status: ProjectStatus.ACTIVE,
            gitRepoUrl: dto.gitRepoUrl,
            members: []

        })

        const savedProject = await this._projectRepsitory.create(Project)

        return {
            id: savedProject.id!,
            name: savedProject.name,
            description: savedProject.description,
            startDate: savedProject.startDate,
            endDate: savedProject.endDate,
            gitRepoUrl: savedProject.gitRepoUrl
        }
    }
}