import type { UpdateSubtaskTimeDTO } from "@application/dtos/subtask/update.subtask.time.dto";
import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { Role } from "@domain/enum/role.enum";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IUpdateSubtaskTimeUseCase } from "../interface/update.subtask.time.interface";

@injectable()
export class UpdateSubtaskTimeUseCase implements IUpdateSubtaskTimeUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskRepository: ISubTaskRepository,
	) {}

	async execute(
		subtaskId: string,
		companyId: string,
		dto: UpdateSubtaskTimeDTO,
		role: Role,
	): Promise<SubTaskEntity> {
		if (role !== "developers") {
			throw new ForbiddenError(
				"Only Developers can update estimated and actual hours",
			);
		}

		const subtask = await this._subtaskRepository.findById(subtaskId);

		if (!subtask) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (subtask.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(
				"Access denied: Subtask belongs to another company",
			);
		}

		subtask.update({
			estimatedHours: dto.estimatedHours,
			actualHours: dto.actualHours,
		});

		const updatedSubtask = await this._subtaskRepository.update(
			subtask.id as string,
			subtask,
		);

		if (!updatedSubtask) {
			throw new Error("Failed to update subtask time");
		}
		return updatedSubtask;
	}
}
