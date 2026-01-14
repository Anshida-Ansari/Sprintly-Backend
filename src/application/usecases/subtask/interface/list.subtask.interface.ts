import { SubTaskEntity } from "@domain/entities/subtask.entity";

export interface IListSubtasksByStoryUseCase {
    execute(userStoryId: string, companyId: string): Promise<SubTaskEntity[]>;
}