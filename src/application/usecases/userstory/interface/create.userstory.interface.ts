import type { CreateUserStoryDTO } from "@application/dtos/userstory/create.userstory.dto";
import type { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

export interface ICreateUserstoryUsecase {
	execute(
		dto: CreateUserStoryDTO,
		companyId: string,
		projectId: string,
	): Promise<{
		id: string;
		title: string;
		description: string;
		priority: PriorityStatus;
		status: UserStoryStatus;
		sprintId?: string;
		createdAt: Date;
	}>;
}
