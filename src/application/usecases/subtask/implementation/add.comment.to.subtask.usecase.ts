import { inject, injectable } from "inversify";
import { IAddCommentToSubtaskUseCase } from "../interface/add.comment.to.subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { NotificationType } from "@domain/enum/notification/notification.types";

@injectable()
export class AddCommentToSubTaskUseCase implements IAddCommentToSubtaskUseCase {
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskReposiotory: ISubTaskRepository,
        @inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
        private _createNotificationUseCase: ICreateNotificationUseCase
    ) { }

    async execute(dto: AddCommentSubTaskDTO): Promise<void> {
        const subtask = await this._subtaskReposiotory.findById(dto.subtaskId)

        if (!subtask) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        subtask.addComment(dto.userId, dto.userName, dto.message)

        await this._subtaskReposiotory.addComment(dto.subtaskId, {
            userId: dto.userId,
            userName: dto.userName,
            message: dto.message,
            createdAt: new Date()
        })

        // Notify assigned user if someone else commented
        if (subtask.assignedTo && subtask.assignedTo.toString() !== dto.userId.toString()) {
            await this._createNotificationUseCase.execute(
                subtask.assignedTo.toString(),
                NotificationType.COMMENT_ADDED,
                `${dto.userName} commented on subtask: ${subtask.title}`,
                dto.subtaskId,
                "SUBTASK",
                dto.userId
            );
        }
    }
}