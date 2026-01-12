import { inject, injectable } from "inversify";

import type { EditUserStoryDTO } from "@application/dtos/userstory/edit.userstory";

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

import type { IEditUserstoryUseCase } from "@application/usecases/userstory/interface/edit.usertory.interface";

@injectable()
export class EditUserStoryUseCase implements IEditUserstoryUseCase {
    constructor(
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userStoryReposiotry: IUserStroyRepository,
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectRepository: IProjectReposiotory
    ) { }

    async execute(dto: EditUserStoryDTO, companyId: string, projectId: string, userstoryId: string): Promise<{ id: string; title: string; description: string; priority: PriorityStatus; status: UserStoryStatus; sprintId?: string; updatedAt?: Date; }> {
        const project = await this._projectRepository.findById(projectId)

        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND)
        }


        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const userStory = await this._userStoryReposiotry.findById(userstoryId)

        if (!userStory) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (
            userStory.projectId.toString() !== projectId.toString() ||
            userStory.companyId.toString() !== companyId.toString()
        ) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }


        userStory.update({
            title: dto.title,
            description: dto.description,
            priority: dto.priority,
            status: dto.status,
            sprintId: dto.sprintId
        })

        const updatedUserstory = await this._userStoryReposiotry.update(userstoryId, userStory)

        if (!updatedUserstory) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND);
        }

        return {
            id: updatedUserstory.id!,
            title: updatedUserstory.title,
            description: updatedUserstory.description,
            priority: updatedUserstory.priority,
            status: updatedUserstory.status,
            sprintId: updatedUserstory.sprintId,
            updatedAt: updatedUserstory.updatedAt,
        };




    }

}
