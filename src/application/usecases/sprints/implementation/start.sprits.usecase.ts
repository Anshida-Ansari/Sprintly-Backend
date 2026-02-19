import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IStartSprintUseCase } from "../interface/start.sprint.interface";

@injectable()
export class StartSprtintsUseCase implements IStartSprintUseCase {
	constructor(
		@inject(SPRINTS_TYPE.ISprintReposiotry)
		private _sprintrepository: ISprintReposiotry,
	) {}

	async execute(companyId: string, sprintId: string): Promise<void> {
		const sprint = await this._sprintrepository.findById(sprintId);

		if (!sprint) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (sprint.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const activeSprints = await this._sprintrepository.findActiveByProject(
			sprint.projectId,
		);

		if (activeSprints.length > 0) {
			throw new ConflictError(
				"There is already an active sprint in this project. Complete it first.",
			);
		}

		sprint.start();

		await this._sprintrepository.update(sprintId, sprint);
	}
}
