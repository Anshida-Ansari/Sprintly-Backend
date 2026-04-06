export interface IAnalyticsRepository {
	getSprintBurndown(sprintId: string): Promise<any[]>;
	getUserBurndown(sprintId: string, userId: string): Promise<any[]>;
}
