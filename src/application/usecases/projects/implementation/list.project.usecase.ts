import type { IListProjectUseCase } from "@application/usecases/projects/interface/list.project.interface";

import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { inject, injectable } from "inversify";

@injectable()
export class ListProjectUseCase implements IListProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectrepository: IProjectReposiotory,
	) {}

	async execute(
		query: { page: number; limit: number; search?: string },
		companyId: string,
		userId: string,
		userRole: string,
	): Promise<{
		data: any[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page, limit, search } = query;
		const filter: any = { companyId };

		if (userRole === "developers" || userRole === "developer") {
			filter.members = userId;
		}

		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}

		const skip = (page - 1) * limit;

		const [projects, count] = await Promise.all([
			this._projectrepository.find(filter, { skip, limit }),
			this._projectrepository.count(filter),
		]);

		return {
			data: projects,
			total: count,
			page,
			limit,
			totalPages: Math.ceil(count / limit),
		};
	}
}
