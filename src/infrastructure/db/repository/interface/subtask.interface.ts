import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { IBaseRepository } from "./base.repository";

export interface ISubTaskRepository extends IBaseRepository<SubTaskEntity> {
	findByUserStoryId(userStoryId: string): Promise<SubTaskEntity[]>;
	findByCompanyId(companyId: string): Promise<SubTaskEntity[]>;
	findByAssignedTo(userId: string): Promise<SubTaskEntity[]>;
	findByUserStoryIds(userStoryIds: string[]): Promise<SubTaskEntity[]>;
	addComment(userStoryId: string, comment: {
		userId: string
		message: string
		createdAt: Date
	}): Promise<void>
}
