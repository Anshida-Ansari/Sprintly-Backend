import type { UserStoryEntity } from "../../../../domain/entities/user.story.entity.js";

export interface IAssignUserStoryUseCase {
	execute(
		userStoryId: string,
		developerId: string,
		companyId: string,
	): Promise<UserStoryEntity>;
}
