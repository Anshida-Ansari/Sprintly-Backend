import type {
	IReportFilter,
	IReportResult,
	IReportsRepository,
} from "@infrastructure/db/repository/interface/reports.interface";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import { inject, injectable } from "inversify";
import type { IGetSubtaskReportsUseCase } from "../interface/reports.usecase.interface";

@injectable()
export class GetSubtaskReportsUseCase implements IGetSubtaskReportsUseCase {
	constructor(
		@inject(REPORTS_TYPE.IReportsRepository)
		private readonly reportsRepository: IReportsRepository,
	) {}

	async execute(
		companyId: string,
		filters: IReportFilter,
	): Promise<IReportResult> {
		return this.reportsRepository.getSubtaskReports(companyId, filters);
	}
}
