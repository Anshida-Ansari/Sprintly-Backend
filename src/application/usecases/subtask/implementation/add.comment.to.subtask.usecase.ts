import type { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IAddCommentToSubtaskUseCase } from "../interface/add.comment.to.subtask.interface";

@injectable()
export class AddCommentToSubTaskUseCase implements IAddCommentToSubtaskUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskRepository: ISubTaskRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userStoryRepository: IUserStoryRepository,
	) {}

	async execute(dto: AddCommentSubTaskDTO): Promise<void> {
		const subtask = await this._subtaskRepository.findById(dto.subtaskId);

		if (!subtask) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		subtask.addComment(dto.userId, dto.userName, dto.message);

		await this._subtaskRepository.addComment(dto.subtaskId, {
			userId: dto.userId,
			userName: dto.userName,
			message: dto.message,
			createdAt: new Date(),
		});

		if (
			subtask.assignedTo &&
			subtask.assignedTo.toString() !== dto.userId.toString()
		) {
			await this._createNotificationUseCase.execute(
				subtask.assignedTo.toString(),
				NotificationType.COMMENT_ADDED,
				`${dto.userName} commented on subtask: ${subtask.title}`,
				dto.subtaskId,
				"SUBTASK",
				dto.userId,
			);
		}

		const userStory = await this._userStoryRepository.findById(
			subtask.userStoryId,
		);
		if (
			userStory?.adminId &&
			userStory.adminId.toString() !== dto.userId.toString()
		) {
			await this._createNotificationUseCase.execute(
				userStory.adminId.toString(),
				NotificationType.COMMENT_ADDED,
				`${dto.userName} commented on subtask: ${subtask.title}`,
				dto.subtaskId,
				"SUBTASK",
				dto.userId,
			);
		}
	}
}
