import { inject, injectable } from "inversify";
import type { CompanyEntity } from "../../../../domain/entities/company.entity.js";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface.js";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface.js";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types.js";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types.js";
import type {
	IDashboardStats,
	IGetDashboardStatsUseCase,
} from "../interface/get.dashboard.stats.interface.js";

@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(): Promise<IDashboardStats> {
		const [allCompanies, totalUsers] = await Promise.all([
			this._companyRepository.find({}, { skip: 0, limit: 10000 }),
			this._userRepository.count({}),
		]);

		const totalCompanies = allCompanies.length;
		const approvedCompanies = allCompanies.filter(
			(c: CompanyEntity) => c.status === "approved",
		).length;
		const pendingCompanies = allCompanies.filter(
			(c: CompanyEntity) => c.status === "pending",
		).length;
		const rejectedCompanies = allCompanies.filter(
			(c: CompanyEntity) => c.status === "rejected",
		).length;

		const recentCompanies = await this._companyRepository.find(
			{},
			{ skip: 0, limit: 5 },
		);

		const enriched = recentCompanies.map((c: CompanyEntity) => ({
			_id: c.id || "",
			companyName: c.companyName,
			email: "", // User entity might have the email, or we need to fetch it. Keeping empty for now to match interface.
			status: c.status,
			createdAt: c.createdAt
				? c.createdAt.toISOString()
				: new Date().toISOString(),
		}));

		return {
			totalCompanies,
			approvedCompanies,
			pendingCompanies,
			rejectedCompanies,
			totalUsers,
			recentCompanies: enriched,
		};
	}
}
