import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { Role } from "@domain/enum/role.enum";
import type { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export interface IUpdateSubtaskStatusUseCase {
	execute(
		subtaskId: string,
		companyId: string,
		newStatus: SubTaskStatus,
		role: Role,
	): Promise<SubTaskEntity>;
}
