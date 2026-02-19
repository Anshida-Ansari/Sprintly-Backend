import type { UserStoryEntity } from "@domain/entities/user.story.entities";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error,r";
import { inject, injectable } from "inversify";
import type { IAssignUserStoryUseCase } from "../interface/assign.userstory.to.member.interface";

@injectable()
export class AssignUserStoryUseCase implements IAssignUserStoryUseCase {
	constructor(
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userstoryRepository: IUserStroyRepository,
	) {}

	async execute(
		userStoryId: string,
		developerId: string,
		companyId: string,
	): Promise<UserStoryEntity> {
		const userStory = await this._userstoryRepository.findById(userStoryId);

		if (!userStory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (userStory.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		userStory.update({ assignedTo: [developerId] });

		const update = await this._userstoryRepository.update(
			userStoryId,
			userStory,
		);

		if (!update) {
			throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT);
		}

		return update;
	}
}
