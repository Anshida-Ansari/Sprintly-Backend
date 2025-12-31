import type { UserStoryEntity } from "src/domain/entities/user.story.entities";
import type { IBaseRepository } from "./base.repository";

export interface IUserStroyRepository extends IBaseRepository<UserStoryEntity> {
	findByProjectId(projectId: string): Promise<UserStoryEntity[]>;
	findBySprintId(sprintId: string): Promise<UserStoryEntity[]>;
	listByProject(params: {
		projectId: string;
		companyId: string;
		page: number;
		limit: number;
		search?: string;
		sprintId?: string;
		status?: string;
	}): Promise<{
		data: UserStoryEntity[];
		total: number;
	}>;
}
