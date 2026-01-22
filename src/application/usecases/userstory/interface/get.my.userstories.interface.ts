import type { UserStoryEntity } from "@domain/entities/user.story.entities";

export interface IGetMyUserStoriesUseCase {
    execute(userId: string): Promise<any[]>;
}
