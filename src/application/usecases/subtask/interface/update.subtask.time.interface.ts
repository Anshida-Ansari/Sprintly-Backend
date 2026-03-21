import { UpdateSubtaskTimeDTO } from "@application/dtos/subtask/update.subtask.time.dto";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { Role } from "@domain/enum/role.enum";

export interface IUpdateSubtaskTimeUseCase {
	execute(
		subtaskId: string,
		companyId: string,
		dto: UpdateSubtaskTimeDTO,
		role: Role,
	): Promise<SubTaskEntity>;
}
