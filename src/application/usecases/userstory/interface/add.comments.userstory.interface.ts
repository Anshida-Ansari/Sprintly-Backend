import { AddCommentDTO } from "@application/dtos/userstory/add.comment.to.usertory.dto";

export interface IAddCommentToUserStoryUseCase{
    execute(dto: AddCommentDTO):Promise<void>
}