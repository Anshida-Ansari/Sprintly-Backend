export interface IDashboardStats {
	totalCompanies: number;
	approvedCompanies: number;
	pendingCompanies: number;
	rejectedCompanies: number;
	totalUsers: number;
	recentCompanies: {
		_id: string;
		companyName: string;
		email: string;
		status: string;
		createdAt: string;
	}[];
}

export interface IGetDashboardStatsUseCase {
	execute(): Promise<IDashboardStats>;
}
