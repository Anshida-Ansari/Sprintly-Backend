import type { CreateSprintDTO } from "@application/dtos/sprints/create.sprints.dto";
import type { SprintStatus } from "@domain/enum/sprints/sprints.status";

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