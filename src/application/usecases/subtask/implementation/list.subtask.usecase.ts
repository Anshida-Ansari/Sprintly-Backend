import type { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { inject, injectable } from "inversify";
import type { IListSubtasksByStoryUseCase } from "../interface/list.subtask.interface";

@injectable()
export class ListSubtasksByStoryUseCase implements IListSubtasksByStoryUseCase {
	constructor(
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private _subtaskrepository: ISubTaskRepository,
	) {}

	async execute(
		userStoryId: string,
		companyId: string,
	): Promise<SubTaskEntity[]> {
		const subtasks =
			await this._subtaskrepository.findByUserStoryId(userStoryId);

		return subtasks.filter(
			(task) => task.companyId.toString() === companyId.toString(),
		);
	}
}
