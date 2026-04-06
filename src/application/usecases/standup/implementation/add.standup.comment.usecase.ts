import type { AddStandupCommentDTO } from "@application/dtos/standup/add.standup.comment.dto";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IAddStandupCommentUseCase } from "../interface/add.standup.comment.interface";

@injectable()
export class AddStandupCommentUseCase implements IAddStandupCommentUseCase {
	constructor(
		@inject(STANDUP_TYPES.IStandupRepository)
		private _standupRepository: IStandupRepository,
	) {}

	async execute(
		dto: AddStandupCommentDTO,
		userId: string,
		userName: string,
		companyId: string,
		sprintId: string,
		projectId: string,
		standupId: string,
	): Promise<void> {
		const standup = await this._standupRepository.findById(standupId);

		if (!standup) {
			throw new NotFoundError("Standup report not found");
		}

		if (
			standup.companyId.toString() !== companyId.toString() ||
			standup.sprintId.toString() !== sprintId.toString()
		) {
			throw new ForbiddenError(
				"You do not have permission to comment on this standup",
			);
		}

		standup.addComment(userId, userName, dto.text);

		await this._standupRepository.update(standupId, standup);
	}
}
