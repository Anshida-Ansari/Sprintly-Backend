export interface RevenueStats {
	totalLifetimeRevenue: number;
	currentMonthRevenue: number;
	previousMonthRevenue: number;
	revenueGrowthPercentage: number;
	revenueHistory: {
		date: string;
		amount: number;
	}[];
}

export interface IGetRevenueAnalyticsUseCase {
	execute(): Promise<RevenueStats>;
}

export interface SubscriptionStats {
	totalUsers: number;
	freeUsers: number;
	paidUsers: number;
	activeSubscriptions: number;
	expiredSubscriptions: number;
	planDistribution: {
		name: string;
		value: number;
	}[];
	growthTrends: {
		date: string;
		count: number;
	}[];
}

export interface IGetSubscriptionMetricsUseCase {
	execute(): Promise<SubscriptionStats>;
}

export interface PlatformStats {
	companyStats: {
		totalCompanies: number;
		activeCompanies: number;
		growthRate: number; // percentage
		newCompaniesThisMonth: number;
	};
	projectStats: {
		totalProjects: number;
		activeProjects: number;
		completedProjects: number;
		avgProjectsPerCompany: number;
	};
	userStats: {
		totalUsers: number;
		activeUsers: number; // DAU (active in last 24h)
		avgUsersPerCompany: number;
	};
}

export interface IGetPlatformAnalyticsUseCase {
	execute(): Promise<PlatformStats>;
}
