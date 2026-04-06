import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import type { UserStoryEntity } from "@domain/entities/user.story.entities";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
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
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
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

		await this._createNotificationUseCase.execute(
			developerId,
			NotificationType.STORY_ASSIGNED,
			`You have been assigned to story: ${update.title}`,
			update.id!,
			"STORY",
		);

		return update;
	}
}
