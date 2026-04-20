export interface IUserStoryComment {
	createdAt: Date;
	message: string;
	userName?: string;
	userId: string;
}

export interface IMyUserStoryResponse {
	id?: string;
	title: string;
	description: string;
	status: string;
	priority: string;
	projectId: string;
	companyId: string;
	sprintId?: string;
	assignedTo?: string[];
	comments: IUserStoryComment[];
	estimationPoints?: number;
	acceptanceCriteria?: string[];
	createdAt: Date;
	updatedAt?: Date;
	subtasks: IMyUserStoryResponse[];
}

export interface IGetMyUserStoriesUseCase {
	execute(userId: string): Promise<IMyUserStoryResponse[]>;
}
