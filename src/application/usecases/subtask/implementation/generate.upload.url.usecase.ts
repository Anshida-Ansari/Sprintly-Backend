import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IStorageService } from "@domain/interface/storage.service.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IGenerateUploadURLUseCase } from "../interface/generate.upload.url.interface";

@injectable()
export class GenrateUploadUrlUseCase implements IGenerateUploadURLUseCase {
	constructor(
		@inject(SUBTASK_TYPE.IStorageService)
		private _storageService: IStorageService,
	) {}

	async execute(
		fileName: string,
		fileType: string,
	): Promise<{ uploadUrl: string; fileUrl: string }> {
		if (!fileName || !fileType) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		return await this._storageService.generateUploadSignedUrl(
			fileName,
			fileType,
		);
	}
}
