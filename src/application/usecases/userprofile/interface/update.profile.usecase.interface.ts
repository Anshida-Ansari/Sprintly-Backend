import { UpdateUserProfileDTO } from "@application/dtos/userprofie/update.profile";
import { UserProfileEntity } from "@domain/entities/user.profile.entities";

export interface IUpdateProfileUseCase{
    execute(dto: UpdateUserProfileDTO,companyId: string, userId: string):Promise<UserProfileEntity>
}