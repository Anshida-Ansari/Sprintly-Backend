import type { IListProjectUseCase } from "@application/usecases/projects/interface/list.project.interface";
import type {
	IProjectRepository,
	IProjectWithAnalytics,
} from "@infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class ListProjectUseCase implements IListProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectrepository: IProjectRepository,
	) {}

	async execute(
		query: { page: number; limit: number; search?: string },
		companyId: string,
		userId: string,
		userRole: string,
	): Promise<{
		data: IProjectWithAnalytics[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page, limit, search } = query;
		const filter: Record<string, unknown> = {
			companyId: new Types.ObjectId(companyId),
		};

		if (userRole === "developers" || userRole === "developer") {
			filter.members = new Types.ObjectId(userId);
		}

		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}

		const skip = (page - 1) * limit;
		const options = { skip, limit };

		const [projects, count] = await Promise.all([
			this._projectrepository.findWithAnalytics(filter, options),
			this._projectrepository.count(filter),
		]);

		return {
			data: projects as any[],
			total: count,
			page,
			limit,
			totalPages: Math.ceil(count / limit),
		};
	}
}
