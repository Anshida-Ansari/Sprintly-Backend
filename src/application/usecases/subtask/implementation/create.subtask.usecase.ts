import type { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { ICreateSubTaskUseCase } from "../interface/create.subtask.interface";

@injectable()
export class CreateSubTaskUseCase implements ICreateSubTaskUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskrepository: ISubTaskRepository,
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userstoryrepository: IUserStroyRepository,
	) {}

	async execute(
		dto: CreateSubTaskDTO,
		companyId: string,
		userStoryId: string,
		role: string,
	): Promise<SubTaskEntity> {
		if (role !== "developers") {
			throw new ForbiddenError("Only Developers can create Subtasks");
		}
		const userstory = await this._userstoryrepository.findById(userStoryId);
		if (!userstory) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (userstory.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(
				"Access denied: User Story belongs to another company",
			);
		}

		const subTask = SubTaskEntity.create({
			title: dto.title,
			userStoryId: userStoryId,
			companyId: companyId,
			estimatedHours: dto.estimatedHours,
		});

		return await this._subtaskrepository.create(subTask);
	}
}
