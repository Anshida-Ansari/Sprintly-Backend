import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import type { UserStoryEntity } from "@domain/entities/user.story.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import type { Role } from "@domain/enum/role.enum";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error";
import { inject, injectable } from "inversify";
import type { IUpdateStatusOfUserStoryInterface } from "../interface/update.userstory.status.interface";

@injectable()
export class UpdateUserStoryUseCase
	implements IUpdateStatusOfUserStoryInterface
{
	constructor(
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userstoryrepository: IUserStoryRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(
		companyId: string,
		userstoryId: string,
		newStatus: UserStoryStatus,
		userRole: Role,
	): Promise<UserStoryEntity> {
		const userstory = await this._userstoryrepository.findById(userstoryId);

		if (!userstory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (userstory.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		if (newStatus === UserStoryStatus.DONE && userRole !== "admin") {
			throw new ForbiddenError("Only admins can mark a story as Done");
		}

		userstory.update({ status: newStatus });
		const updated = await this._userstoryrepository.update(
			userstoryId,
			userstory,
		);

		if (!updated) {
			throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT);
		}

		if (
			newStatus === UserStoryStatus.DONE &&
			updated.assignedTo &&
			updated.assignedTo.length > 0
		) {
			for (const assigneeId of updated.assignedTo) {
				if (!updated.id) {
					throw new Error("Updated Story ID is missing");
				}
				await this._createNotificationUseCase.execute(
					assigneeId.toString(),
					NotificationType.STORY_COMPLETED,
					`Story marked as completed: ${updated.title}`,
					updated.id,
					"STORY",
				);
			}
		}

		return updated;
	}
}
