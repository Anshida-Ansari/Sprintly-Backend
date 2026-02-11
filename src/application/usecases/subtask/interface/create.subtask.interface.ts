import type { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import type { SubTaskEntity } from "@domain/entities/subtask.entity";

export interface ICreateSubTaskUseCase {
	execute(
		dto: CreateSubTaskDTO,
		companyId: string,
		userStoryId: string,
		role: string,
	): Promise<SubTaskEntity>;
}
