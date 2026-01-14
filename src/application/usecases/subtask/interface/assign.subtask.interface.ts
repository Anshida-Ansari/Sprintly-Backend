import { SubTaskEntity } from "@domain/entities/subtask.entity";

export interface IAssignSubtaskUseCase {
    execute(subtaskId: string, userId: string, companyId: string): Promise<SubTaskEntity>;
}