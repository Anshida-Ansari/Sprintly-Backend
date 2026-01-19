import { SubmitStandupDTO } from "@application/dtos/standup/submit.standup.dto";

export interface ISubmitStandupUseCase {
    execute(dto: SubmitStandupDTO,
        userId: string,
        sprintId: string,
        projectId: string,
        companyId: string
    ): Promise<void>
}