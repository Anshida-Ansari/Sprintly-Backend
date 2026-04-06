import type { AddCommentDTO } from "@application/dtos/userstory/add.comment.to.usertory.dto";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IAddCommentToUserStoryUseCase } from "../interface/add.comments.userstory.interface";

@injectable()
export class AddCommentToUserStoryUseCase
	implements IAddCommentToUserStoryUseCase
{
	constructor(
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userStoryRepository: IUserStroyRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(dto: AddCommentDTO): Promise<void> {
		const userStory = await this._userStoryRepository.findById(dto.userStoryId);

		if (!userStory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		userStory.addComment(dto.userId, dto.userName, dto.message);

		await this._userStoryRepository.addComment(dto.userStoryId, {
			userId: dto.userId,
			userName: dto.userName,
			message: dto.message,
			createdAt: new Date(),
		});

		if (userStory.assignedTo && userStory.assignedTo.length > 0) {
			for (const assigneeId of userStory.assignedTo) {
				if (assigneeId.toString() !== dto.userId.toString()) {
					await this._createNotificationUseCase.execute(
						assigneeId.toString(),
						NotificationType.COMMENT_ADDED,
						`${dto.userName} commented on story: ${userStory.title}`,
						dto.userStoryId,
						"STORY",
						dto.userId,
					);
				}
			}
		}

		if (
			userStory.adminId &&
			userStory.adminId.toString() !== dto.userId.toString()
		) {
			await this._createNotificationUseCase.execute(
				userStory.adminId.toString(),
				NotificationType.COMMENT_ADDED,
				`${dto.userName} commented on story: ${userStory.title}`,
				dto.userStoryId,
				"STORY",
				dto.userId,
			);
		}
	}
}
