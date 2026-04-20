import type { UserStoryEntity } from "@domain/entities/user.story.entity";
import type { Role } from "@domain/enum/role.enum";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

export interface IUpdateStatusOfUserStoryInterface {
	execute(
		companyId: string,
		userstoryId: string,
		newStatus: UserStoryStatus,
		userRole: Role,
	): Promise<UserStoryEntity>;
}
