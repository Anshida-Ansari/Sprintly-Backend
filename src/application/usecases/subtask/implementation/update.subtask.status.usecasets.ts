import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { Role } from "@domain/enum/role.enum";
import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error,r";
import { inject, injectable } from "inversify";
import type { IUpdateSubtaskStatusUseCase } from "../interface/update.subtask.status.interface";

@injectable()
export class UpdateSubtaskStatusUseCase implements IUpdateSubtaskStatusUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskrepository: ISubTaskRepository,
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userstoryrepository: IUserStroyRepository,
	) {}

	async execute(
		subtaskId: string,
		companyId: string,
		newStatus: SubTaskStatus,
		role: Role,
	): Promise<SubTaskEntity> {
		const subtask = await this._subtaskrepository.findById(subtaskId);

		if (!subtask) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (subtask.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		if (role !== Role.DEVELOPERS) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		subtask.update({ status: newStatus });

		const updated = await this._subtaskrepository.update(subtaskId, subtask);

		if (!updated) {
			throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT);
		}

		const allSubtasks = await this._subtaskrepository.findByUserStoryId(
			subtask.userStoryId,
		);
		const parentUserstory = await this._userstoryrepository.findById(
			subtask.userStoryId,
		);

		if (parentUserstory) {
			const totalSubtask = allSubtasks.length;
			const completedTask = allSubtasks.filter(
				(t) => t.status === SubTaskStatus.COMPLETED,
			).length;

			let storyNewStatus = parentUserstory.status;

			if (totalSubtask > 0 && completedTask === totalSubtask) {
				storyNewStatus = UserStoryStatus.IN_REVIEW;
			} else if (
				completedTask > 0 &&
				parentUserstory.status === UserStoryStatus.IN_PENDING
			) {
				storyNewStatus = UserStoryStatus.IN_PROGRESS;
			} else if (
				completedTask < totalSubtask &&
				newStatus === SubTaskStatus.PENDING &&
				parentUserstory.status === UserStoryStatus.DONE
			) {
				storyNewStatus = UserStoryStatus.IN_PROGRESS;
			}

			if (storyNewStatus !== parentUserstory.status) {
				parentUserstory.update({ status: storyNewStatus });
				await this._userstoryrepository.update(
					parentUserstory.id!,
					parentUserstory,
				);
			}
		}

		return updated;
	}
}
