import type { WorkLogEntity } from "@domain/entities/worklog.entity";

export interface ICreateWorkLogUseCase {
	execute(
		userId: string,
		data: {
			subTaskId: string;
			hours: number;
			description: string;
			date: Date;
		},
	): Promise<WorkLogEntity>;
}

export interface IGetUserWorkLogsUseCase {
	execute(
		userId: string,
		filters?: Record<string, unknown>,
	): Promise<{ logs: WorkLogEntity[]; totalHours: number }>;
}

export interface IGetAdminWorkLogsUseCase {
	execute(
		companyId: string,
		filters?: Record<string, unknown>,
	): Promise<unknown>;
}
