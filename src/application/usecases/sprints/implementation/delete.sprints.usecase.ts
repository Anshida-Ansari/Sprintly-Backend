import { inject, injectable } from "inversify";
import { IDeleteSprintUseCase } from "../interface/delete.sprints.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";

@injectable()
export class DeleteSprintUseCase implements IDeleteSprintUseCase{
    constructor(
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _spritRepositoryUsecase:ISprintReposiotry,
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryRepostioty:IUserStroyRepository
    ){}

    async execute(sprintId: string, companyId: string): Promise<void> {
        const sprint = await this._spritRepositoryUsecase.findById(sprintId)
        
        if(!sprint){
            throw new NotFoundError(ErrorMessage.NOT_FOUND
            )
        }

        if (sprint.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError("Not authorized");
        }
        
        const stories = await this._userstoryRepostioty.findBySprintId(sprintId)

        const updatePromises = stories.map(story => {
            story.update({ sprintId: undefined });
            return this._userstoryRepostioty.update(story.id!, story);
        });
        await Promise.all(updatePromises);

        await this._spritRepositoryUsecase.delete(sprintId);
        

    }
}