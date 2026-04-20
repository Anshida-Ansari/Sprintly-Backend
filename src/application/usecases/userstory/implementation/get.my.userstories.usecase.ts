import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { inject, injectable } from "inversify";
import type { IGetMyUserStoriesUseCase, IMyUserStoryResponse } from "../interface/get.my.userstories.interface";

@injectable()
export class GetMyUserStoriesUseCase implements IGetMyUserStoriesUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subTaskRepository: ISubTaskRepository,
		@inject(USERSTORY_TYPE.IUserStroyRepository)
		private _userStoryRepository: IUserStroyRepository,
	) {}

	async execute(userId: string): Promise<IMyUserStoryResponse[]> {
		const mySubtasks = await this._subTaskRepository.findByAssignedTo(userId);
		const myStories = await this._userStoryRepository.findByAssignedTo(userId);

		const storyIdsFromSubtasks = mySubtasks.map((s) => s.userStoryId);
		const storyIdsFromAssignment = myStories.map((s) => {
			if (!s.id) {
				throw new Error(`User story ID for ${s.title} is missing`);
			}
			return s.id;
		});

		const userStoryIds = [
			...new Set([...storyIdsFromSubtasks, ...storyIdsFromAssignment]),
		];

		if (userStoryIds.length === 0) {
			return [];
		}

		const userStories = await this._userStoryRepository.findByIds(userStoryIds);

		const allSubtasks =
			await this._subTaskRepository.findByUserStoryIds(userStoryIds);

		const result = userStories.map((story) => {
			const storySubtasks = allSubtasks.filter(
				(st) => st.userStoryId.toString() === story.id?.toString(),
			);

			return {
				id: story.id,
				title: story.title,
				description: story.description,
				status: story.status,
				priority: story.priority,
				projectId: story.projectId,
				companyId: story.companyId,
				sprintId: story.sprintId,
				assignedTo: story.assignedTo,
				comments: story.comments || [],
				estimationPoints: story.estimationPoints,
				acceptanceCriteria: story.acceptanceCriteria,
				createdAt: story.createdAt,
				updatedAt: story.updatedAt,
				subtasks: storySubtasks,
			};
		});

		return result;
	}
}
