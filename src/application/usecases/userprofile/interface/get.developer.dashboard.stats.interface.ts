export interface IDeveloperDashboardStats {
	currentFocus: {
		id: string;
		title: string;
		status: string;
		description: string;
		estimatedHours: number;
		actualHours: number;
	} | null;
	upNext: {
		id: string;
		title: string;
		priority: string;
		dueDate: string;
	}[];
	schedule: {
		id: string;
		title: string;
		date: Date;
		roomId: string;
		status: string;
	}[];
	dailyTargets: {
		completedTasks: number;
		totalTasks: number;
		loggedHours: number;
		totalHours: number;
	};
}

export interface IGetDeveloperDashboardStatsUseCase {
	execute(userId: string, companyId: string): Promise<IDeveloperDashboardStats>;
}
