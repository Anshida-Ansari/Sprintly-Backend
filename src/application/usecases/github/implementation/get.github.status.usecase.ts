import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { GitHubStatusResponse } from "../../../dtos/github/github.status.response";
import type { IGetGitHubStatusUseCase } from "../interface/get.github.status.interface";

@injectable()
export class GetGitHubStatusUseCase implements IGetGitHubStatusUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute(companyId: string): Promise<GitHubStatusResponse> {
		const company = await this._companyRepository.findById(companyId);
		if (!company) {
			throw new NotFoundError("Company not found");
		}

		const isConnected = !!company.githubAccessToken;

		return {
			isConnected: isConnected,
			githubUsername: company.githubUsername,
			githubOrganization: company.githubOrganization,
			connectedAt: company.githubConnectedAt,
		};
	}
}
