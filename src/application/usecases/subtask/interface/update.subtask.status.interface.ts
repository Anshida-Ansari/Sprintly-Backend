import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { Role } from "@domain/enum/role.enum";
import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export interface IUpdateSubtaskStatusUseCase{
    execute(
        subtaskId: string,
        companyId: string,
        newStatus: SubTaskStatus,
        role: Role
    ):Promise<SubTaskEntity>
}