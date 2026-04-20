import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { ICompleteSprintUseCase } from "../interface/complete.sprints.interface";

@injectable()
export class CompleteSprintUseCase implements ICompleteSprintUseCase {
	constructor(
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintRepsitory: ISprintRepository,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userstoryRepository: IUserStoryRepository,
	) {}

	async execute(sprintId: string, _companyId: string): Promise<void> {
		const sprint = await this._sprintRepsitory.findById(sprintId);
		if (!sprint) throw new NotFoundError(ErrorMessage.NOT_FOUND);

		sprint.complete();
		await this._sprintRepsitory.update(sprintId, sprint);

		const stories = await this._userstoryRepository.findBySprintId(sprintId);

		for (const story of stories) {
			if (story.status !== UserStoryStatus.DONE) {
				story.update({ sprintId: undefined });
				if (story.id) {
					await this._userstoryRepository.update(story.id, story);
				}
			}
		}
	}
}
