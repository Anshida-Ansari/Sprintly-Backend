import { inject, injectable } from "inversify";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { IProjectRepository } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";

export interface TopCompany {
	companyName: string;
	projectCount: number;
	userCount: number;
}

@injectable()
export class GetTopCompaniesUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectRepository,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(): Promise<TopCompany[]> {
		const companies = await this._companyRepository.findAll();
		const projects = await this._projectRepository.findAll();
		const users = await this._userRepository.findAll();

		const topCompanies = companies.map((c) => {
			const projectCount = projects.filter(
				(p) => p.companyId?.toString() === c.id?.toString(),
			).length;
			const userCount = users.filter(
				(u) => u.companyId?.toString() === c.id?.toString(),
			).length;

			return {
				companyName: c.companyName,
				projectCount,
				userCount,
			};
		});

		// Sort by project count and then user count
		return topCompanies
			.sort(
				(a, b) => b.projectCount - a.projectCount || b.userCount - a.userCount,
			)
			.slice(0, 5);
	}
}
