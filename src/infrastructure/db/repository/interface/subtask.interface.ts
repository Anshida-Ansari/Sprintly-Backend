import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { IBaseRepository } from "./base.repository";

export interface ITopMember {
	id: string;
	name: string;
	email: string;
	role: string;
	completedCount: number;
}

export interface ISubTaskRepository extends IBaseRepository<SubTaskEntity> {
	findByUserStoryId(userStoryId: string): Promise<SubTaskEntity[]>;
	findByCompanyId(companyId: string): Promise<SubTaskEntity[]>;
	findByAssignedTo(userId: string): Promise<SubTaskEntity[]>;
	findByUserStoryIds(userStoryIds: string[]): Promise<SubTaskEntity[]>;
	getTopMembers(companyId: string, limit: number): Promise<ITopMember[]>;
	getLiveActivity(companyId: string, limit: number): Promise<SubTaskEntity[]>;
	addComment(
		userStoryId: string,
		comment: {
			userId: string;
			userName: string;
			message: string;
			createdAt: Date;
		},
	): Promise<void>;
}
