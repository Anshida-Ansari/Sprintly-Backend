import { SubTaskEntity } from "@domain/entities/subtask.entity";

export interface IAssignSubtaskUseCase {
    execute(subtaskId: string, developerId: string, companyId: string): Promise<SubTaskEntity>;
}