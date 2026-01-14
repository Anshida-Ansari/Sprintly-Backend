
import type { SprintEntity } from "../../../../domain/entities/sptint.entities";
import type { IBaseRepository } from "./base.repository";

export interface ISprintReposiotry extends IBaseRepository<SprintEntity> {
  findActiveByProject(projectId: string): Promise<SprintEntity[]>;
  hasActiveSprint(projectId: string): Promise<boolean>;
  hasOverlappingSprint(
    projectId: string,
    startDate: Date,
    endDate: Date,
    excludeSprintId?: string
  ): Promise<boolean>
  findByProject(projectId: string, companyId: string): Promise<SprintEntity[]>;
  listByProject(params: {
    projectId: string
    companyId: string
    page: number
    limit: number
    search?: string
    status?: string
  }): Promise<{
    data: SprintEntity[]
    total: number
  }>
}