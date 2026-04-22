import type { GetMyProfileResponse } from "../implementation/res/get.profile.usecase.response";

export interface IGetProfileUseCase {
	execute(userId: string, companyId: string): Promise<GetMyProfileResponse>;
}
