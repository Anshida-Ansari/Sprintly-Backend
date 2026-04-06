import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { inject, injectable } from "inversify";
import type { IWorkLogRepository } from "@infrastructure/db/repository/interface/worklog.interface";
import type { IGetAdminWorkLogsUseCase } from "../interface/worklog.usecase.interface";

@injectable()
export class GetAdminWorkLogsUseCase implements IGetAdminWorkLogsUseCase {
	constructor(
		@inject(WORKLOG_TYPE.IWorkLogRepository)
		private readonly _workLogRepository: IWorkLogRepository,
	) {}

	async execute(companyId: string, filters: any = {}): Promise<any> {
		// This uses the repository's aggregation for advanced reporting
		return await this._workLogRepository.getWorkLogAnalytics(companyId, filters);
	}
}
