import { inject, injectable } from "inversify";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { ICompleteSprintUseCase } from "../interface/complete.sprints.interface";

@injectable()
export class CompleteSprintUseCase implements ICompleteSprintUseCase{
    constructor(
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _sprintRepsitory:ISprintReposiotry,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryRepository:IUserStroyRepository
    ){}

    async execute(sprintId: string, companyId: string): Promise<void> {
        
        const sprint = await this._sprintRepsitory.findById(sprintId);
        if (!sprint) throw new NotFoundError(ErrorMessage.NOT_FOUND);

        sprint.complete()
        await this._sprintRepsitory.update(sprintId,sprint)

        const stories = await this._userstoryRepository.findBySprintId(sprintId)
        
        for (const story of stories) {
            if (story.status !== UserStoryStatus.DONE) {
                story.update({ sprintId: undefined }); 
                await this._userstoryRepository.update(story.id!, story);
            }
        }
    }
}