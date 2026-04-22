import type { EditUserStoryDTO } from "@application/dtos/userstory/edit.userstory";
import type { IEditUserstoryUseCase } from "@application/usecases/userstory/interface/edit.usertory.interface";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";

import type { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

import type { IProjectRepository } from "@infrastructure/db/repository/interface/project.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";

import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";

import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error";
import { inject, injectable } from "inversify";

@injectable()
export class EditUserStoryUseCase implements IEditUserstoryUseCase {
	constructor(
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userStoryRepository: IUserStoryRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectRepository,
	) {}

	async execute(
		dto: EditUserStoryDTO,
		companyId: string,
		projectId: string,
		userstoryId: string,
	): Promise<{
		id: string;
		title: string;
		description: string;
		priority: PriorityStatus;
		status: UserStoryStatus;
		assignedTo?: string[];
		comments?: Array<{
			createdAt: Date;
			message: string;
			userName?: string;
			userId: string;
		}>;
		estimationPoints?: number;
		acceptanceCriteria?: string[];
		sprintId?: string;
		updatedAt?: Date;
	}> {
		const project = await this._projectRepository.findById(projectId);

		if (!project) {
			throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND);
		}

		if (project.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const userStory = await this._userStoryRepository.findById(userstoryId);

		if (!userStory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (
			userStory.projectId.toString() !== projectId.toString() ||
			userStory.companyId.toString() !== companyId.toString()
		) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		if (dto.assignedTo && dto.assignedTo.length > 0) {
			const uniqueMembers = new Set(dto.assignedTo);
			if (uniqueMembers.size !== dto.assignedTo.length) {
				throw new ForbiddenError("Duplicate assignee not allowed");
			}
		}

		userStory.update({
			title: dto.title,
			description: dto.description,
			priority: dto.priority,
			status: dto.status,
			sprintId: dto.sprintId,
			assignedTo: dto.assignedTo,
			estimationPoints: dto.estimationPoints,
			acceptanceCriteria: dto.acceptanceCriteria,
		});

		const updatedUserstory = await this._userStoryRepository.update(
			userstoryId,
			userStory,
		);

		if (!updatedUserstory) {
			throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT);
		}

		if (!updatedUserstory.id) {
			throw new Error("Updated User Story ID is missing");
		}

		return {
			id: updatedUserstory.id,
			title: updatedUserstory.title,
			description: updatedUserstory.description,
			priority: updatedUserstory.priority,
			status: updatedUserstory.status,
			sprintId: updatedUserstory.sprintId,
			assignedTo: updatedUserstory.assignedTo,
			comments: updatedUserstory.comments || [],
			estimationPoints: updatedUserstory.estimationPoints,
			acceptanceCriteria: updatedUserstory.acceptanceCriteria,
			updatedAt: updatedUserstory.updatedAt,
		};
	}
}
