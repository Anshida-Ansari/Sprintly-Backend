import { inject, injectable } from "inversify";
import { ProjectStatus } from "../../../../domain/enum/project/project.status";
import { UserStatus } from "../../../../domain/enum/status.enum"; // This has BLOCK/ACTIVE
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import type { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import type {
	IGetPlatformAnalyticsUseCase,
	PlatformStats,
} from "../interface/get.analytics.interface";

@injectable()
export class GetPlatformAnalyticsUseCase
	implements IGetPlatformAnalyticsUseCase
{
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(): Promise<PlatformStats> {
		const [companies, projects, users] = await Promise.all([
			this._companyRepository.findAll(),
			this._projectRepository.findAll(),
			this._userRepository.findAll(),
		]);

		const now = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(now.getMonth() - 1);
		const twoMonthsAgo = new Date();
		twoMonthsAgo.setMonth(now.getMonth() - 2);

		// Company Stats
		const activeCompanies = companies.filter(
			(c) => c.status === "approved",
		).length;
		const newCompaniesThisMonth = companies.filter((c) => {
			const createdAt = c.createdAt ? new Date(c.createdAt) : null;
			return createdAt && createdAt >= oneMonthAgo;
		}).length;
		const newCompaniesLastMonth = companies.filter((c) => {
			const createdAt = c.createdAt ? new Date(c.createdAt) : null;
			return createdAt && createdAt >= twoMonthsAgo && createdAt < oneMonthAgo;
		}).length;

		const growthRate =
			newCompaniesLastMonth === 0
				? newCompaniesThisMonth > 0
					? 100
					: 0
				: ((newCompaniesThisMonth - newCompaniesLastMonth) /
						newCompaniesLastMonth) *
					100;

		// Project Stats
		const activeProjects = projects.filter(
			(p) => p.status === ProjectStatus.ACTIVE,
		).length;
		const completedProjects = projects.filter(
			(p) => p.status === ProjectStatus.COMPLETED,
		).length;
		const avgProjectsPerCompany =
			companies.length === 0 ? 0 : projects.length / companies.length;

		// User Stats
		const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		const activeUsersCount = users.filter((u) => {
			const lastActive = u.lastActive ? new Date(u.lastActive) : null;
			return (
				u.status === UserStatus.ACTIVE &&
				lastActive &&
				lastActive >= twentyFourHoursAgo
			);
		}).length;
		const avgUsersPerCompany =
			companies.length === 0 ? 0 : users.length / companies.length;

		return {
			companyStats: {
				totalCompanies: companies.length,
				activeCompanies,
				growthRate: Math.round(growthRate * 100) / 100,
				newCompaniesThisMonth,
			},
			projectStats: {
				totalProjects: projects.length,
				activeProjects,
				completedProjects,
				avgProjectsPerCompany: Math.round(avgProjectsPerCompany * 10) / 10,
			},
			userStats: {
				totalUsers: users.length,
				activeUsers: activeUsersCount,
				avgUsersPerCompany: Math.round(avgUsersPerCompany * 10) / 10,
			},
		};
	}
}
