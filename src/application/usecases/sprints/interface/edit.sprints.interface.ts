import { EditSprintDTO } from "@application/dtos/sprints/edit.sprints.dto";
import { SprintStatus } from "@domain/enum/sprints/sprints.status";

export interface IEditSprintUseCase {
  execute(
    dto: EditSprintDTO,
    sprintId: string,
    projectId: string,
    companyId: string,
  ): Promise<{
    id: string
    name: string
    goal: string
    status: SprintStatus
    createdAt:Date
    
  }>;
}
