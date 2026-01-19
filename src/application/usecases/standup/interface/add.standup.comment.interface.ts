import { AddStandupCommentDTO } from "@application/dtos/standup/add.standup.comment.dto";

export interface IAddStandupCommentUseCase{
    execute(dto: AddStandupCommentDTO,
         userId: string, 
         userName: string, 
         companyId: string, 
         sprintId: string,
         projectId: string,
         standupId: string,
        ):Promise<void>
}