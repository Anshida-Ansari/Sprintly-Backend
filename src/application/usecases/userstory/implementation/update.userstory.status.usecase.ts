import { inject, injectable } from "inversify";
import { IUpdateStatusOfUserStoryInterface } from "../interface/update.userstory.status.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { UserStoryEntity } from "@domain/entities/user.story.entities";
import { Role } from "@domain/enum/role.enum";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error,r";

@injectable()
export class UpdateUserStoryUseCase implements IUpdateStatusOfUserStoryInterface{
    constructor(
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryrepository:IUserStroyRepository
    ){ }

    async execute(companyId: string, userstoryId: string, newStatus: UserStoryStatus, userRole: Role): Promise<UserStoryEntity> {
        
        const userstory = await this._userstoryrepository.findById(userstoryId)

        if(!userstory){
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (userstory.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN);
        }

        if (newStatus === UserStoryStatus.DONE && userRole !== "admin") {
            throw new ForbiddenError("Only admins can mark a story as Done");
        }

        userstory.update({status:newStatus})
        const updated = await this._userstoryrepository.update(userstoryId,userstory)

        if(!updated){
            throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT)
        }

        return updated


    }
}