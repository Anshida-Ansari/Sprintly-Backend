import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { IUserProfileRepository } from "@infrastructure/db/repository/interface/user.profile.interface";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IGetProfileUseCase } from "../interface/get.profile.usecase.interface";
import type { GetMyProfileResponse } from "./res/get.profile.usecase.response";

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
	constructor(
		@inject(USER_PROFILE_TYPE.IUserProfileRepository)
		private _userprofilerepository: IUserProfileRepository,
	) {}

	async execute(
		userId: string,
		companyId: string,
	): Promise<GetMyProfileResponse> {
		const profile = await this._userprofilerepository.findOne({
			userId,
			companyId,
		});

		if (!profile) {
			throw new NotFoundError(ErrorMessage.NOT_FOUND);
		}

		if (!profile.id) {
			throw new Error("Profile ID is missing");
		}

		return {
			id: profile.id,
			userId: profile.userId,
			companyId: profile.companyId,
			phoneNumber: profile.phoneNumber,
			address: profile.address,
			bio: profile.bio,
			skills: profile.skills ?? [],
			avatarUrl: profile.avatarUrl,
			linkedin: profile.linkedin,
			github: profile.github,
		};
	}
}
