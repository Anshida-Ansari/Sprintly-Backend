import { SprintEntity } from "../../../../domain/entities/sptint.entities";
import { IBaseRepository } from "./base.repository";

export interface ISprintReposiotry extends IBaseRepository<SprintEntity>{
    findActiveSprintByProject(projectId: string): Promise<SprintEntity | null>;
    hasActiveSprint(projectId: string): Promise<boolean>;
    hasOverlappingSprint(
    projectId: string,
    startDate: Date,
    endDate: Date,
    excludeSprintId?: string
  ): Promise<boolean>
    findByProject(projectId: string, companyId: string): Promise<SprintEntity[]>;
}