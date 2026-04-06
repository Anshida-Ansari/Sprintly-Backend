import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IStorageService } from "@domain/interface/storage.service.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IGenerateDownloadUrlUseCase } from "../interface/generate.download.url.interface";

@injectable()
export class GenerateDownloadUrlUseCase implements IGenerateDownloadUrlUseCase {
	constructor(
		@inject(SUBTASK_TYPE.IStorageService)
		private _storageService: IStorageService,
	) {}

	async execute(fileUrl: string): Promise<string> {
		if (!fileUrl) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		return await this._storageService.generateDownloadSignedUrl(fileUrl);
	}
}
