import { inject, injectable } from "inversify";
import { ICreateSprintUseCase } from "../interface/create.sprint.interface";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";
import { ISprintReposiotry } from "src/infrastructure/db/repository/interface/sprints.interface";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { CreateSprintDTO } from "src/application/dtos/sprints/create.sprints.dto";
import { SprintStatus } from "src/domain/enum/sprints/sprints.status";
import { NotFoundError } from "src/shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "src/domain/enum/project/project.error.message";
import { ForbiddenError } from "src/shared/utils/error-handling/errors/forbidden.error";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { SprintEntity } from "src/domain/entities/sptint.entities";
import { ConflictError } from "src/shared/utils/error-handling/errors/conflict.error";
import { SprintErrorMessage } from "src/domain/enum/sprints/sprints.error.message";

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