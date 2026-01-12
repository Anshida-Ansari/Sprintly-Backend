import type { EditUserStoryDTO } from "@application/dtos/userstory/edit.userstory";
import type { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

export interface IEditUserstoryUseCase {
	execute(
		dto: EditUserStoryDTO,
		companyId: string,
		projectId: string,
		userstoryId: string,
	): Promise<{
		id: string;
		title: string;
		description: string;
		priority: PriorityStatus;
		status: UserStoryStatus;
		updatedAt?: Date;
	}>;
}
