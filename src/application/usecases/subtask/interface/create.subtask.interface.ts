import { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import { SubTaskEntity } from "@domain/entities/subtask.entity";


export interface ICreateSubTaskUseCase {
    execute(
        dto: CreateSubTaskDTO, 
        companyId: string,
        userStoryId: string
    ): Promise<SubTaskEntity>;
}