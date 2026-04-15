import { inject, injectable } from "inversify";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import type { IGetCompanySubscriptionUseCase } from "../interface/get.company.subscription.interface";

@injectable()
export class GetCompanySubscriptionUseCase implements IGetCompanySubscriptionUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
	) {}

	async execute(companyId: string) {
		const company = await this._companyRepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		const projectCount = await this._projectRepository.count({ companyId });

		return {
			currentPlan: company.currentPlan,
			projectLimit: company.projectLimit,
			projectCount,
			isLimitReached: company.hasReachedProjectLimit(projectCount),
			subscriptionEndDate: company.subscriptionEndDate ? company.subscriptionEndDate.toISOString() : null,
			stripeSubscriptionId: company.stripeSubscriptionId ?? null,
		};
	}
}
