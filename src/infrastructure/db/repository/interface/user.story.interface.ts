import type { UserStoryEntity } from "../../../../domain/entities/user.story.entities";
import type { IBaseRepository } from "./base.repository";

export interface IUserStroyRepository extends IBaseRepository<UserStoryEntity> {
	findByProjectId(projectId: string): Promise<UserStoryEntity[]>;
	findBySprintId(sprintId: string): Promise<UserStoryEntity[]>;
	findByIds(ids: string[]): Promise<UserStoryEntity[]>;
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
	findByAssignedTo(userId: string): Promise<UserStoryEntity[]>;
	addComment(userStoryId: string, comment:{
		userId: string
		message: string
		createdAt: Date
	}):Promise<void>
	// findCountOfUserStories(userStoryId: string):Promise<number>
}
