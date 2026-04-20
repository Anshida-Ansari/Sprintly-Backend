import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IDeleteSubtaskUseCase } from "../interface/delete.subtask.interface";

@injectable()
export class DeleteSubtaskUseCase implements IDeleteSubtaskUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskrespository: ISubTaskRepository,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userStoryrepository: IUserStoryRepository,
	) {}

	async execute(subtaskId: string, companyId: string): Promise<void> {
		const subtask = await this._subtaskrespository.findById(subtaskId);
		if (!subtask) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (subtask.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const userStoryId = subtask.userStoryId;

		await this._subtaskrespository.delete(subtaskId);

		const remainingTasks =
			await this._subtaskrespository.findByUserStoryId(userStoryId);
		const parentStory = await this._userStoryrepository.findById(userStoryId);

		if (parentStory) {
			let targetStatus = parentStory.status;

			if (remainingTasks.length > 0) {
				const completedCount = remainingTasks.filter(
					(t) => t.status === SubTaskStatus.COMPLETED,
				).length;
				const totalCount = remainingTasks.length;

				if (completedCount === totalCount) {
					targetStatus = UserStoryStatus.DONE;
				} else if (completedCount > 0) {
					targetStatus = UserStoryStatus.IN_PROGRESS;
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

		return;
	}
}
