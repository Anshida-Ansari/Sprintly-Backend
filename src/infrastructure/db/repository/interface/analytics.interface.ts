export interface IAnalyticsRepository {
	getSprintBurndown(sprintId: string, type: "hours" | "points"): Promise<any>;
	getUserBurndown(sprintId: string, userId: string, type: "hours" | "points"): Promise<any>;
	getDashboardAnalytics(companyId: string, filters: any): Promise<any>;
}
