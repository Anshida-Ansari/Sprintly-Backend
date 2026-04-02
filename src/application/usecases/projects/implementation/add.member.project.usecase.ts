import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { inject, injectable } from "inversify";
import { IAddMemberToProjectUseCase } from "../interface/add.member.project.interface";

@injectable()
export class AddMemberToProjectUseCase implements IAddMemberToProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(
		projectId: string,
		memberId: string,
		companyId: string,
	): Promise<void> {
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
			(member) => member.toString() === memberId,
		);

		if (isAlreadyMember) {
			throw new ConflictError("User is already a member of this project");
		}

		project.addMember(memberId);

		await this._projectRepository.updateProject(projectId, project);

		// Trigger Notification
		await this._createNotificationUseCase.execute(
			memberId,
			NotificationType.USER_ADDED_TO_PROJECT,
			`You have been added as a member to project: ${project.name}`,
			projectId,
			"PROJECT",
		);
	}
}
