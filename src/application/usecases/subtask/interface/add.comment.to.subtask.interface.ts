import { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";
import { AddCommentDTO } from "@application/dtos/userstory/add.comment.to.usertory.dto";

export interface IAddCommentToSubtaskUseCase{
    execute(dto:AddCommentSubTaskDTO):Promise<void>
}