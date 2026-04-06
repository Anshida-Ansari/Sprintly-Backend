import type { GetMyProfileResponse } from "../imeplementation/res/get.profile.usecase.response";

export interface IGetProfileUseCase {
	execute(userId: string, companyId: string): Promise<GetMyProfileResponse>;
}
