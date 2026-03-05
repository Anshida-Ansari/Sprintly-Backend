import { inject, injectable } from "inversify";
import { IUpdateProfileUseCase } from "../interface/update.profile.usecase.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { IUserProfileRepository } from "@infrastructure/db/repository/interface/user.profile.interface";
import { UpdateUserProfileDTO } from "@application/dtos/userprofie/update.profile";
import { UserProfileEntity } from "@domain/entities/user.profile.entities";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        @inject(USER_PROFILE_TYPE.IUserProfileRepository)
        private _userprofilereposiotory: IUserProfileRepository
    ){}

    async execute(dto: UpdateUserProfileDTO, companyId: string, userId: string): Promise<UserProfileEntity> {
        
        let profile = await this._userprofilereposiotory.findOne({
            userId,
            companyId
        })

        if(!profile){
            profile = UserProfileEntity.create({
                userId,
				companyId,
				phoneNumber: dto.phoneNumber,
				address: dto.address,
				bio: dto.bio,
				skills: dto.skills ?? [],
				avatarUrl: dto.avatarUrl,
				linkedin: dto.linkedin,
				github: dto.github,
            })
            return await this._userprofilereposiotory.create(profile)
        }

         profile?.updateProfile({
            phoneNumber: dto.phoneNumber,
			address: dto.address,
			bio: dto.bio,
			skills: dto.skills,
			avatarUrl: dto.avatarUrl,
			linkedin: dto.linkedin,
			github: dto.github,
        })

        await this._userprofilereposiotory.update(profile.id!, profile)

        return profile
       
    }
    

}