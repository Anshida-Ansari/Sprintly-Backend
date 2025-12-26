import { inject, injectable } from "inversify";
import { IEditProjectUsecase } from "../interface/edit.project.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { EditProjectDTO } from "src/application/dtos/projects/edit.project.dto";
import { EditProjectResponse } from "./res/edit.project.response";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "src/domain/enum/project/project.error.message";


@injectable()
export class EditProjectUseCase implements IEditProjectUsecase {
    constructor(
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectreposiotry: IProjectReposiotory
    ) { }

    async execute(projectId: string, dto: EditProjectDTO, adminId: string, companyId: string): Promise<EditProjectResponse> {

        const existingProject = await this._projectreposiotry.findOne({ _id: projectId, companyId })

        console.log('the existing project', existingProject)

        if (!existingProject) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }

        existingProject.update({
            name: dto.name,
            description: dto.description,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            gitRepoUrl: dto.gitRepoUrl,
            status: dto.status
        });

        const updatedProject = await this._projectreposiotry.updateProject(projectId, existingProject)

        if (!updatedProject) {
            throw new Error("Failed to update project");
        }

        return {
            id: updatedProject.id!,
            name: updatedProject.name,
            description: updatedProject.description,
            startDate: updatedProject.startDate ? updatedProject.startDate.toISOString() : undefined,
            endDate: updatedProject.endDate ? updatedProject.endDate.toISOString() : undefined,
            gitRepoUrl: updatedProject.gitRepoUrl,
            status: updatedProject.status

        }


    }

}