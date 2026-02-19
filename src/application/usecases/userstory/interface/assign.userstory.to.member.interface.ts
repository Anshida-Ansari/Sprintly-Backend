import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { UserStoryEntity } from "@domain/entities/user.story.entities";

export interface IAssignUserStoryUseCase {
	execute(
		userStoryId: string,
		developerId: string,
		companyId: string,
	): Promise<UserStoryEntity>;
}
