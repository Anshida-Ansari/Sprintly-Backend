import { inject, injectable } from "inversify";
import { ICreateSubTaskUseCase } from "../interface/create.subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";

@injectable()
export class CreateSubTaskUseCase implements ICreateSubTaskUseCase{
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskrepository:ISubTaskRepository,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryrepository:IUserStroyRepository
    ){}

    async execute(dto: CreateSubTaskDTO, companyId: string, userStoryId: string): Promise<SubTaskEntity> {
        
        const userstory = await this._userstoryrepository.findById(userStoryId)
        if(!userstory){
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (userstory.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError("Access denied: User Story belongs to another company");
        }

        const subTask = SubTaskEntity.create({
            title: dto.title,
            userStoryId:userStoryId,
            companyId: companyId,
            assignedTo: dto.assignedTo

        })

        return await this._subtaskrepository.create(subTask)


    }
}