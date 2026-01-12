import { inject, injectable } from "inversify";

import type { CreateUserStoryDTO } from "@application/dtos/userstory/create.userstory.dto";

import { UserStoryEntity } from "@domain/entities/user.story.entities";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";

import type { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";

import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";

import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";

import type { ICreateUserstoryUsecase } from "@application/usecases/userstory/interface/create.userstory.interface";

@injectable()
export class CreateUserstoryUseCase implements ICreateUserstoryUsecase {
    constructor(
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryReposiotry: IUserStroyRepository,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectReposiotory: IProjectReposiotory
    ) { }

    async execute(dto: CreateUserStoryDTO, companyId: string, projectId: string): Promise<{ id: string; title: string; description: string; priority: PriorityStatus; status: UserStoryStatus; sprintId?: string; createdAt: Date; }> {

        const project = await this._projectReposiotory.findById(projectId)
        console.log('companyId', companyId);
        console.log('project company Id', project?.companyId)

        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }



        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }


        const userstory = UserStoryEntity.create({
            projectId,
            companyId,
            title: dto.title,
            description: dto.description,
            priority: dto.priority,
        })

        const created = await this._userstoryReposiotry.create(userstory)

        return {
            id: created.id!,
            title: created.title,
            description: created.description,
            priority: created.priority,
            status: created.status,
            createdAt: created.createdAt,
        }


    }

}