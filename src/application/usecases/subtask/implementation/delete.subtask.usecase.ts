import { inject, injectable } from "inversify";
import { IDeleteSubtaskUseCase } from "../interface/delete.subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

@injectable()
export class DeleteSubtaskUseCase implements IDeleteSubtaskUseCase {
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskrespository: ISubTaskRepository,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userStoryrepository: IUserStroyRepository
    ) { }

    async execute(subtaskId: string, companyId: string): Promise<void> {
        const subtask = await this._subtaskrespository.findById(subtaskId)
        if (!subtask) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (subtask.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const userStoryId = subtask.userStoryId

        await this._subtaskrespository.delete(subtaskId);

        const remainingTasks = await this._subtaskrespository.findByUserStoryId(userStoryId);
        const parentStory = await this._userStoryrepository.findById(userStoryId);

        if (parentStory) {
            let targetStatus = parentStory.status;

            if (remainingTasks.length > 0) {
                const completedCount = remainingTasks.filter(t => t.status === SubTaskStatus.COMPLETED).length;
                const totalCount = remainingTasks.length;

                if (completedCount === totalCount) {
                    targetStatus = UserStoryStatus.DONE;
                } else if (completedCount > 0) {
                    targetStatus = UserStoryStatus.IN_PROGREDD;
                } else {
                    targetStatus = UserStoryStatus.IN_PENDING;
                }
            } else {
                targetStatus = UserStoryStatus.IN_PENDING;
            }

            if (targetStatus !== parentStory.status) {
                parentStory.update({ status: targetStatus });
                await this._userStoryrepository.update(userStoryId, parentStory);
            }
        }

        return 
    }

}