import type { IListSprintsUseCase } from "@application/usecases/sprints/interface/list.sprints.interface";
import type { SprintEntity } from "@domain/entities/sprint.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import type { IProjectRepository } from "@infrastructure/db/repository/interface/project.interface";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";

@injectable()
export class ListSprintsUseCase implements IListSprintsUseCase {
	constructor(
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintsrepository: ISprintRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectrepository: IProjectRepository,
	) {}

	async execute(
		query: { page: number; limit: number; search?: string; status?: string },
		companyId: string,
		projectId: string,
	): Promise<{
		data: SprintEntity[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const project = await this._projectrepository.findById(projectId);

		if (!project) {
			throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND);
		}

		if (project.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}
		const { page, limit } = query;
		const { data, total } = await this._sprintsrepository.listByProject({
			projectId,
			companyId,
			...query,
		});

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}
