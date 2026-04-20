import type { AssignUserStoryToSprintDTO } from "@application/dtos/userstory/assign.userstory.to.sprints.dto";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error";
import { inject, injectable } from "inversify";
import type { IAssignUserStoriesToSprintUseCase } from "../interface/assign.userstory.to.sprints.interface";

@injectable()
export class AssignUserStoryToSprintUseCase
	implements IAssignUserStoriesToSprintUseCase
{
	constructor(
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userstoryreposiotory: IUserStoryRepository,
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintrepository: ISprintRepository,
	) {}

	async execute(
		dto: AssignUserStoryToSprintDTO,
		companyId: string,
		projectId: string,
	): Promise<{ message: "Assigned to Srpitns" }> {
		const sprint = await this._sprintrepository.findById(dto.sprintId);

		if (!sprint) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (sprint.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const userstory = await this._userstoryreposiotory.findById(
			dto.userStoryId,
		);

		if (!userstory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (userstory.projectId.toString() !== projectId.toString()) {
			throw new ForbiddenError("User story does not belong to this project");
		}

		userstory.update({ sprintId: sprint.id });

		if (!userstory.id) {
			throw new Error("User Story ID is missing");
		}

		const updatedresult = await this._userstoryreposiotory.update(
			userstory.id,
			userstory,
		);

		if (!updatedresult) {
			throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT);
		}

		return {
			message: "Assigned to Srpitns",
		};
	}
}
