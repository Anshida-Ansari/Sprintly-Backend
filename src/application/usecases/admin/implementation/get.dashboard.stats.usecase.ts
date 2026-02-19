import { inject, injectable } from "inversify";
import { ProjectStatus } from "../../../../domain/enum/project/project.status";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { ISprintReposiotry } from "../../../../infrastructure/db/repository/interface/sprints.interface";
import type { IUserStroyRepository } from "../../../../infrastructure/db/repository/interface/user.story.interface";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "../../../../infrastructure/di/types/spirnts/sprints.types";
import { USERSTORY_TYPE } from "../../../../infrastructure/di/types/userstory/userstory";
import type {
	IDashboardStats,
	IGetDashboardStatsUseCase,
} from "../interface/get.dashboard.stats.interface";

@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
		@inject(SPRINTS_TYPE.ISprintReposiotry)
		private _sprintRepository: ISprintReposiotry,
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userStoryRepository: IUserStroyRepository,
	) {}

	async execute(companyId: string): Promise<IDashboardStats> {
		const activeProjects = await this._projectRepository.count({
			companyId: companyId,
			status: ProjectStatus.ACTIVE,
		});

		const runningSprints = await this._sprintRepository.count({
			companyId: companyId,
			status: "ACTIVE",
		});

		const pendingReviews = await this._userStoryRepository.count({
			companyId: companyId,
			status: "IN_REVIEW",
		});

		return {
			activeProjects,
			runningSprints,
			pendingReviews,
		};
	}
}
