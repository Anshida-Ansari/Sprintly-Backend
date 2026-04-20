import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IDeleteSprintUseCase } from "../interface/delete.sprints.interface";

@injectable()
export class DeleteSprintUseCase implements IDeleteSprintUseCase {
	constructor(
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _spritRepositoryUsecase: ISprintRepository,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private _userstoryRepostioty: IUserStoryRepository,
	) {}

	async execute(sprintId: string, companyId: string): Promise<void> {
		const sprint = await this._spritRepositoryUsecase.findById(sprintId);

		if (!sprint) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (sprint.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError("Not authorized");
		}

		const stories = await this._userstoryRepostioty.findBySprintId(sprintId);

		const updatePromises = stories.map((story) => {
			story.update({ sprintId: undefined });
			if (!story.id) {
				throw new Error("Story ID is missing");
			}
			return this._userstoryRepostioty.update(story.id, story);
		});
		await Promise.all(updatePromises);

		await this._spritRepositoryUsecase.delete(sprintId);
	}
}
