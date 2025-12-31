import { SprintEntity } from "../../../../domain/entities/sptint.entities";
import { IBaseRepository } from "./base.repository";

export interface ISprintReposiotry extends IBaseRepository<SprintEntity>{
    findByProject(projectId: string, companyId: string): Promise<SprintEntity[]>;
    list(query: { page: number; limit: number; status?: string; startDate?: Date; endDate?: Date }, companyId: string, projectId: string): Promise<{ data: SprintEntity[]; total: number; totalPages: number }>;
}