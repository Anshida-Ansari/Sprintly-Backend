import { SprintEntity } from "@domain/entities/sptint.entities";

export interface IListSprintsUseCase{
    execute(
        query: {
            page: number
            limit: number
            search?: string
            status?: string
        },
        companyId: string,
        projectId: string
    ): Promise<{
        data:SprintEntity[]
        total: number
        page: number
        limit: number
        totalPages: number
    }>;
}

