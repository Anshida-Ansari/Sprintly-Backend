import { AssignUserStoryToSprintDTO } from "@application/dtos/userstory/assign.userstory.to.sprints.dto";

export interface IAssignUserStoriesToSprintUseCase{
    execute(
        dto:AssignUserStoryToSprintDTO,
        companyId: string,
        projectId: string
    ): Promise<{
        message:'Assigned to Srpitns'
    }>
}