import { CreateUserStoryDTO } from "src/application/dtos/userstory/create.userstory.dto";
import { PriorityStatus } from "src/domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "src/domain/enum/userstory/user.story.status";

export interface ICreateUserstoryUsecase{
    execute(dto:CreateUserStoryDTO , companyId: string):Promise<{
        tilte: string
        description: string
        priority:PriorityStatus
        sprintId?: string
        status?:UserStoryStatus
    }>
}