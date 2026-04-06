import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IStorageService } from "@domain/interface/storage.service.interface";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IAddAttachementsUseCase } from "../interface/add.attachements.interface";

@injectable()
export class AddAttachementes implements IAddAttachementsUseCase {
	constructor(
		@inject(SUBTASK_TYPE.IStorageService)
		private _storageService: IStorageService,
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskRepsiotory: ISubTaskRepository,
	) {}

	async execute(
		subTaskId: string,
		fileUrl: string,
		fileName: string,
		uploadedBy: string,
	): Promise<void> {
		const subtask = await this._subtaskRepsiotory.findById(subTaskId);

		if (!subtask) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		subtask.addAttachment(fileUrl, fileName, uploadedBy);

		await this._subtaskRepsiotory.update(subtask.id!, subtask);
	}
}
