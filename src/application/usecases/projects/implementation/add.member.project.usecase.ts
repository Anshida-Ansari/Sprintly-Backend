import { inject, injectable } from "inversify";
import type { IAddMemberToProjectUseCase } from "../interface/add.member.project.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";

@injectable()
export class AddMemberToProjectUseCase implements IAddMemberToProjectUseCase {
    constructor(
        @inject(PROJECT_TYPE.IProjectRepository)
        private _projectRepository: IProjectReposiotory,
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository,
    ) { }

    async execute(projectId: string, memberId: string, companyId: string,): Promise<void> {

        const project = await this._projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND);
        }

        if (project.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN);
        }

        const member = await this._userRepository.findById(memberId);

        if (!member) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        }


        if (member.companyId?.toString() !== companyId.toString()) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        }

        const isAlreadyMember = project.members.some(
            (member) => member.toString() === memberId
        )

        if (isAlreadyMember) {
            throw new ConflictError("User is already a member of this project");
        }

        project.addMember(memberId);

        await this._projectRepository.updateProject(projectId, project);
    }
}
