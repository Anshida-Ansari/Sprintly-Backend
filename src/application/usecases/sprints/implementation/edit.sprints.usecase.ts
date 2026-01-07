import { inject, injectable } from "inversify";
import { IEditSprintUseCase } from "@application/usecases/sprints/interface/edit.sprints.interface";
import { EditSprintDTO } from "@application/dtos/sprints/edit.sprints.dto";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { SprintStatus } from "@domain/enum/sprints/sprints.status";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { InternalServerError } from "@shared/utils/error-handling/errors/internal.server.error";

@injectable()
export class EditSprintUseCase implements IEditSprintUseCase {
    constructor(
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _sprintRepository: ISprintReposiotry,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectRepository: IProjectReposiotory
    ) { }

    async execute(dto: EditSprintDTO, sprintId: string, projectId: string, companyId: string): Promise<{ id: string; name: string; goal: string; status: SprintStatus; createdAt: Date; }> {

        const project = await this._projectRepository.findById(projectId)

        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }

        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const sprint = await this._sprintRepository.findById(sprintId)
        if (!sprint) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (
            sprint.projectId.toString() !== projectId.toString() ||
            sprint.companyId.toString() !== companyId.toString()
        ) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        if (sprint.status === SprintStatus.COMPLETED) {
            throw new InternalServerError(ErrorMessage.CANNOT_EDIT)
        }


        if (dto.startDate && dto.endDate) {
            if (dto.startDate >= dto.endDate) {
                throw new InternalServerError(ErrorMessage.CANNOT_EDIT);
            }
        }

        sprint.update({
            name: dto.name,
            goal: dto.goal,
            startDate: dto.startDate,
            endDate: dto.endDate
        })
    

      await this._sprintRepository.update(sprintId,sprint)

      return{
        id: sprint.id!,
        name:sprint.name,
        goal:sprint.goal!,
        status:sprint.status,
        createdAt:sprint.createdAt

      }
    }

}