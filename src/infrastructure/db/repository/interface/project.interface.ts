import { ProjectEntity } from "src/domain/entities/project.entities";
import { IBaseRepository } from "../interface/base.repository";
import { ProjectStatus } from "src/domain/enum/project/project.status";

export interface IProjectReposiotory extends IBaseRepository<ProjectEntity>{
    
    findByUserId(userId: string):Promise<ProjectEntity | null>
    findByStatus(status :ProjectStatus):Promise<ProjectEntity[]>
    findByAdminId(adminId: string):Promise<ProjectEntity | null>    
}