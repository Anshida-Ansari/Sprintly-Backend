import { UserStoryEntity } from "@domain/entities/user.story.entities";
import { Role } from "@domain/enum/role.enum";
import { UserStoryStatus } from "@domain/enum/userstory/user.story.status";

export interface IUpdateStatusOfUserStoryInterface{
    execute(
        companyId:string,
        userstoryId: string,
        newStatus: UserStoryStatus,
        userRole:Role
    
):Promise<UserStoryEntity>
}