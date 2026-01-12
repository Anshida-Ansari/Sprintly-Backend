import { inject, injectable } from "inversify";
import { IAssignUserStoriesToSprintUseCase } from "../interface/assign.userstory.to.sprints.interface";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { AssignUserStoryToSprintDTO } from "@application/dtos/userstory/assign.userstory.to.sprints.dto";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { IUserStroyRepository } from "@infrastructure/db/repository/interface/user.story.interface";
import { ServiceUnavailableError } from "@shared/utils/error-handling/errors/service.unavailable.error,r";

@injectable()
export class AssignUserStoryToSprintUseCase implements IAssignUserStoriesToSprintUseCase {
    constructor(
        @inject(USERSTORY_TYPE.IUserStroyRepository)
        private _userstoryreposiotory: IUserStroyRepository,
        @inject(SPRINTS_TYPE.ISprintReposiotry)
        private _sprintrepository: ISprintReposiotry
    ) { }

  async execute(dto: AssignUserStoryToSprintDTO, companyId: string, projectId: string): Promise<{ message: "Assigned to Srpitns"; }> {
      const sprint = await this._sprintrepository.findById(dto.sprintId)

        if (!sprint) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (sprint.companyId.toString() !== companyId.toString()) {
            throw new ForbiddenError(ErrorMessage.FORBIDDEN)
        }

        const userstory = await this._userstoryreposiotory.findById(dto.userStoryId)

        if (!userstory) {
            throw new NotFoundError(ErrorMessage.NOT_FOUND)
        }

        if (userstory.projectId.toString() !== projectId.toString()) {
            throw new ForbiddenError("User story does not belong to this project");
        }

         userstory.update({sprintId:sprint.id})

       const updatedresult =  await this._userstoryreposiotory.update(
        userstory.id!,
        userstory
       )

       if(!updatedresult){
        throw new ServiceUnavailableError(ErrorMessage.CANNOT_EDIT)
       }

      return{
        message:'Assigned to Srpitns'
      }

  }
}