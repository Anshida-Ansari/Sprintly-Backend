import { IBaseRepository } from "./base.repository";
import { UserStoryEntity } from "src/domain/entities/user.story.entities";


export interface IUserStroyRepository extends IBaseRepository<UserStoryEntity>{
   findByProjectId(projectId: string):Promise<UserStoryEntity[]>
   findBySprintId(sprintId: string):Promise<UserStoryEntity[]>
}