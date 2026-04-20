export interface IAnalyticsRepository {
	getSprintBurndown(
		sprintId: string,
		type: "hours" | "points",
	): Promise<Record<string, unknown>>;
	getUserBurndown(
		sprintId: string,
		userId: string,
		type: "hours" | "points",
	): Promise<Record<string, unknown>>;
	getDashboardAnalytics(
		companyId: string,
		filters: Record<string, unknown>,
	): Promise<unknown>;
}
