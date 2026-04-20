import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type {
	ICompanyDetail,
	IGetDetailPageUseCase,
} from "../interface/get.detailpage.interface";

@injectable()
export class GetDetailPageUseCase implements IGetDetailPageUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyrepository: ICompanyRepository,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(companyId: string): Promise<ICompanyDetail> {
		const company = await this._companyrepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND);
		}

		let email = "";
		if (company.adminId) {
			const user = await this._userRepository.findById(company.adminId);
			if (user) {
				email = user.email;
			}
		}

		return {
			_id: company.id,
			companyName: company.companyName,
			status: company.status,
			adminId: company.adminId,
			createdAt: company.createdAt,
			email: email,
		};
	}
}
