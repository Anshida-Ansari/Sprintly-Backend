import { SubTaskEntity } from "@domain/entities/subtask.entity";
import { IBaseRepository } from "./base.repository";

export interface ISubTaskRepository extends IBaseRepository<SubTaskEntity> {
    findByUserStoryId(userStoryId: string): Promise<SubTaskEntity[]>;
    findByCompanyId(companyId: string): Promise<SubTaskEntity[]>;
}