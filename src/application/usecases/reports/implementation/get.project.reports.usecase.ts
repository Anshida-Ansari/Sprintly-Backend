import { inject, injectable } from "inversify";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import type { IReportsRepository } from "@infrastructure/db/repository/interface/reports.interface";
import type { IGetProjectReportsUseCase } from "../interface/reports.usecase.interface";

@injectable()
export class GetProjectReportsUseCase implements IGetProjectReportsUseCase {
	constructor(
		@inject(REPORTS_TYPE.IReportsRepository)
		private readonly reportsRepository: IReportsRepository,
	) {}

	async execute(companyId: string, filters: any): Promise<{ data: any[]; total: number }> {
		return this.reportsRepository.getProjectReports(companyId, filters);
	}
}
