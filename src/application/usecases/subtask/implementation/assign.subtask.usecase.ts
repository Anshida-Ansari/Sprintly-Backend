import { inject, injectable } from "inversify";
import { IAssignSubtaskUseCase } from "../interface/assign.subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error,r";

@injectable()
export class AssignSubtaskUseCase implements IAssignSubtaskUseCase{
    constructor(
        @inject(SUBTASK_TYPE.ISubTaskRepository)
        private _subtaskrepository:ISubTaskRepository
    ){}

    async execute(subtaskId: string, developerId: string, companyId: string): Promise<SubTaskEntity> {
        
        const subtask  = await this._subtaskrepository.findById(subtaskId)

        if(!subtask){
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if(subtask.companyId.toString() !== companyId.toString()){
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        subtask.update({assignedTo:developerId})

        const update = await this._subtaskrepository.update(subtaskId,subtask)

        if(!update){
            throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT)
        }

        return update
    }
}