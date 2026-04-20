import type { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";

export interface IAddCommentToSubtaskUseCase {
	execute(dto: AddCommentSubTaskDTO): Promise<void>;
}
