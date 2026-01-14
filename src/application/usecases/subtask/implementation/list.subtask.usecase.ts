import { inject, injectable } from "inversify";
import { IListSubtasksByStoryUseCase } from "../interface/list.subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";

@injectable()
export class ListSubtasksByStoryUseCase implements IListSubtasksByStoryUseCase {
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskrepository: ISubTaskRepository,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryrepository: IUserStroyRepository
    ) { }

    async execute(userStoryId: string, companyId: string): Promise<SubTaskEntity[]> {

        const subtasks = await this._subtaskrepository.findByUserStoryId(userStoryId)

        return subtasks.filter(task => task.companyId.toString() === companyId.toString());




    }
}