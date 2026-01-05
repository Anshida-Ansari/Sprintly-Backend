import { CreateSprintDTO } from "src/application/dtos/sprints/create.sprints.dto";
import { SprintStatus } from "src/domain/enum/sprints/sprints.status";

export interface ICreateSprintUseCase{
    execute(
        dto: CreateSprintDTO,
        projectId: string,
        companyId: string
    ): Promise<{
        id: string,
        name: string,
        goal: string,
        status: SprintStatus
        createdAt: Date
    }>
}