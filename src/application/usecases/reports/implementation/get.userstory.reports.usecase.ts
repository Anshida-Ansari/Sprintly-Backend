import type { IReportFilter, IReportResult, IReportsRepository } from "@infrastructure/db/repository/interface/reports.interface";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import { inject, injectable } from "inversify";
import type { IGetUserStoryReportsUseCase } from "../interface/reports.usecase.interface";

@injectable()
export class GetUserStoryReportsUseCase implements IGetUserStoryReportsUseCase {
	constructor(
		@inject(REPORTS_TYPE.IReportsRepository)
		private readonly reportsRepository: IReportsRepository,
	) {}

	async execute(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		return this.reportsRepository.getUserStoryReports(companyId, filters);
	}
}
