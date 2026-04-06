import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { inject, injectable } from "inversify";
import type {
	IDashboardStats,
	IGetDashboardStatsUseCase,
} from "../interface/get.dashboard.stats.interface";

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
			(c: any) => c.status === "approved",
		).length;
		const pendingCompanies = allCompanies.filter(
			(c: any) => c.status === "pending",
		).length;
		const rejectedCompanies = allCompanies.filter(
			(c: any) => c.status === "rejected",
		).length;

		const recentCompanies = await this._companyRepository.find(
			{},
			{ skip: 0, limit: 5 },
		);

		const enriched = recentCompanies.map((c: any) => ({
			_id: c._id?.toString() || c.id,
			companyName: c.companyName,
			email: c.email || "",
			status: c.status,
			createdAt: c.createdAt,
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
