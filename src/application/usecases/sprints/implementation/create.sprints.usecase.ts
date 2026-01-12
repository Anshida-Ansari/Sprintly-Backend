import { inject, injectable } from "inversify";
import type { ICreateSprintUseCase } from "@application/usecases/sprints/interface/create.sprint.interface";
import type { CreateSprintDTO } from "@application/dtos/sprints/create.sprints.dto";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import type { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { SprintEntity } from "@domain/entities/sptint.entities";
import { SprintStatus } from "@domain/enum/sprints/sprints.status";
import { SprintErrorMessage } from "@domain/enum/sprints/sprints.error.message";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";

@injectable()
export class CreateSprintUseCase implements ICreateSprintUseCase{
    constructor(
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _sprintRepository: ISprintReposiotry,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectReposiotry: IProjectReposiotory
    ){}

    async execute(dto: CreateSprintDTO, projectId: string, companyId: string): Promise<{ id: string; name: string; goal: string; status: SprintStatus; createdAt: Date; }> {
        const project = await this._projectReposiotry.findById(projectId)
        if(!project){
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }

        if(project.companyId.toString() !== companyId.toString()){
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const activeSprints = await this._sprintRepository.findActiveSprintByProject(projectId)

        if(activeSprints){
            throw new ConflictError(SprintErrorMessage.ACTIVE_SPRINT)

        }

        const overlappingSprint = await this._sprintRepository.hasOverlappingSprint(projectId,dto.startDate,dto.endDate)

        if(overlappingSprint){
            throw new ConflictError(SprintErrorMessage.SPRINTS_OVERLAP)
        }

        const sprint = SprintEntity.create({
            projectId,
            companyId,
            name:dto.name,
            goal:dto.goal,
            startDate:dto.startDate,
            endDate:dto.endDate,
            status:SprintStatus.PLANNED
        })

        const createdSprint = await this._sprintRepository.create(sprint)

        return{
            id: createdSprint.id!,
            name: createdSprint.name,
            goal: createdSprint.goal!,
            status: createdSprint.status,
            createdAt: createdSprint.createdAt

        }

    }
}