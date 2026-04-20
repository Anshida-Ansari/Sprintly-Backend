import type { WorkLogEntity } from "@domain/entities/worklog.entity";
import type { IWorkLogRepository } from "@infrastructure/db/repository/interface/worklog.interface";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { inject, injectable } from "inversify";
import type { IGetUserWorkLogsUseCase } from "../interface/worklog.usecase.interface";

@injectable()
export class GetUserWorkLogsUseCase implements IGetUserWorkLogsUseCase {
	constructor(
		@inject(WORKLOG_TYPE.IWorkLogRepository)
		private readonly _workLogRepository: IWorkLogRepository,
	) {}

	async execute(
		userId: string,
		filters: Record<string, unknown> = {},
	): Promise<{ logs: WorkLogEntity[]; totalHours: number }> {
		const logs = await this._workLogRepository.findByUserId(userId, filters);

		const totalHours = parseFloat(
			logs.reduce((acc, log) => acc + log.hours, 0).toFixed(2),
		);

		return {
			logs,
			totalHours,
		};
	}
}
