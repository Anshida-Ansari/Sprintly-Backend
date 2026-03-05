import { inject, injectable } from "inversify";
import { IGetProfileUseCase } from "../interface/get.profile.usecase.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { IUserProfileRepository } from "@infrastructure/db/repository/interface/user.profile.interface";
import { GetMyProfileResponse } from "./res/get.profile.usecase.response";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase{
    constructor(
        @inject(USER_PROFILE_TYPE.IUserProfileRepository)
        private _userprofilerepository: IUserProfileRepository
    ){}

    async execute(userId: string, companyId: string): Promise<GetMyProfileResponse> {
        
        let profile = await this._userprofilerepository.findOne({
            userId,
            companyId
        })


        if(!profile){
          throw new NotFoundError(ErrorMessage.NOT_FOUND)  
        }

        return{
            id: profile.id!,
			userId: profile.userId,
			companyId: profile.companyId,
			phoneNumber: profile.phoneNumber,
			address: profile.address,
			bio: profile.bio,
			skills: profile.skills ?? [],
			avatarUrl: profile.avatarUrl,
			linkedin: profile.linkedin,
			github: profile.github,
        }
    }
}