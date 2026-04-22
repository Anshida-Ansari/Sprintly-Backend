export interface IDashboardEnrichedTask {
	id?: string;
	userStoryId: string;
	companyId: string;
	title: string;
	status: string;
	assignedTo?: string;
	estimatedHours?: number;
	actualHours?: number;
	comments?: unknown[];
	attachments?: unknown[];
	createdAt?: Date;
	updatedAt?: Date;
	completedAt?: Date;
	projectName: string;
	sprintName: string;
	dueDate: Date | null;
}

export interface IDeveloperDashboardStats {
	currentFocus: {
		id: string;
		title: string;
		status: string;
		projectName: string;
		sprintName: string;
		estimatedHours: number;
		actualHours: number;
		dueDate: Date | null;
	} | null;
	todayTasks: {
		id: string;
		title: string;
		projectName: string;
		status: string;
		priority: string;
		dueDate: Date | null;
		isOverdue: boolean;
	}[];
	myTasks: {
		pending: IDashboardEnrichedTask[];
		inProgress: IDashboardEnrichedTask[];
		completed: IDashboardEnrichedTask[];
	};
	activeSprint: {
		id: string;
		name: string;
		daysLeft: number;
		totalTasks: number;
		completedTasks: number;
		completionPercentage: number;
	} | null;
	performance: {
		tasksCompletedThisWeek: number;
		hoursWorkedThisWeek: number;
		completionRate: number;
	};
	recentActivity: {
		id: string;
		type: "TASK_UPDATE" | "COMMENT_ADDED";
		title: string;
		message: string;
		timestamp: Date;
	}[];
	schedule: {
		id: string;
		title: string;
		date: Date;
		roomId: string;
		status: string;
	}[];
}

export interface IGetDeveloperDashboardStatsUseCase {
	execute(userId: string, companyId: string): Promise<IDeveloperDashboardStats>;
}
