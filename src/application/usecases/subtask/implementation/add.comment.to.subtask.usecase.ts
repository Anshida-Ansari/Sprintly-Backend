import { inject, injectable } from "inversify";
import { IAddCommentToSubtaskUseCase } from "../interface/add.comment.to.subtask.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { AddCommentDTO } from "@application/dtos/userstory/add.comment.to.usertory.dto";
import { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

@injectable()
export class AddCommentToSubTaskUseCase implements IAddCommentToSubtaskUseCase {
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskReposiotory: ISubTaskRepository
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
    }

}