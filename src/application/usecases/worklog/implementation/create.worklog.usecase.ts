import { WorkLogEntity } from "@domain/entities/worklog.entity";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import type { IUserStoryRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import type { IWorkLogRepository } from "@infrastructure/db/repository/interface/worklog.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
// import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/user.story";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { ICreateWorkLogUseCase } from "../interface/worklog.usecase.interface";

@injectable()
export class CreateWorkLogUseCase implements ICreateWorkLogUseCase {
	constructor(
		@inject(WORKLOG_TYPE.IWorkLogRepository)
		private readonly _workLogRepository: IWorkLogRepository,
		@inject(SUBTASK_TYPE.ISubTaskRepository)
		private readonly _subTaskRepository: ISubTaskRepository,
		@inject(USERSTORY_TYPE.IUserStoryRepository)
		private readonly _userStoryRepository: IUserStoryRepository,
	) {}

	async execute(
		userId: string,
		data: {
			subTaskId: string;
			hours: number;
			description: string;
			date: Date;
		},
	): Promise<WorkLogEntity> {
		// 1. Fetch SubTask
		const subTask = await this._subTaskRepository.findById(data.subTaskId);
		if (!subTask) {
			throw new NotFoundError("Subtask not found");
		}

		// 2. Fetch User Story to get Project and Sprint IDs
		const userStory = await this._userStoryRepository.findById(
			subTask.userStoryId,
		);
		if (!userStory) {
			throw new NotFoundError("User story (task) not found for this subtask");
		}

		// 3. Create WorkLog Entity
		const workLog = WorkLogEntity.create({
			userId,
			projectId: userStory.projectId,
			sprintId: userStory.sprintId || "", // Might be optional if story not in sprint yet
			taskId: userStory.id as string,
			subTaskId: subTask.id as string,
			hours: data.hours,
			description: data.description,
			date: new Date(data.date),
		});

		// 4. Update SubTask Actual Hours
		const currentActualHours = subTask.actualHours || 0;
		subTask.update({
			actualHours: currentActualHours + data.hours,
		});
		await this._subTaskRepository.update(subTask.id as string, subTask);

		// 5. Save WorkLog
		return await this._workLogRepository.create(workLog);
	}
}
