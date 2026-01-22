import { inject, injectable } from "inversify";
import { IGetMyUserStoriesUseCase } from "../interface/get.my.userstories.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";

@injectable()
export class GetMyUserStoriesUseCase implements IGetMyUserStoriesUseCase {
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subTaskRepository: ISubTaskRepository,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userStoryRepository: IUserStroyRepository
    ) { }

    async execute(userId: string): Promise<any[]> {
        // Step 1: Find all subtasks assigned to this user
        const mySubtasks = await this._subTaskRepository.findByAssignedTo(userId);

        if (mySubtasks.length === 0) {
            return [];
        }

        // Step 2: Get unique user story IDs from those subtasks
        const userStoryIds = [...new Set(mySubtasks.map((s) => s.userStoryId))];

        // Step 3: Fetch the user stories
        const userStories = await this._userStoryRepository.findByIds(userStoryIds);

        // Step 4: Fetch ALL subtasks for these user stories (for context)
        const allSubtasks = await this._subTaskRepository.findByUserStoryIds(userStoryIds);

        // Step 5: Map user stories with their subtasks
        const result = userStories.map((story) => {
            const storySubtasks = allSubtasks.filter(
                (st) => st.userStoryId.toString() === story.id?.toString()
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
                createdAt: story.createdAt,
                updatedAt: story.updatedAt,
                subtasks: storySubtasks
            };
        });

        return result;
    }
}
