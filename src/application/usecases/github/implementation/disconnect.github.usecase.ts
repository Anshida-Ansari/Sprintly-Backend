import { inject, injectable } from "inversify";
import type { IDisconnectGitHubUseCase } from "../interface/disconnect.github.interface";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";

@injectable()
export class DisconnectGitHubUseCase implements IDisconnectGitHubUseCase {
    constructor(
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyRepository: ICompanyRepository,
    ) { }

    async execute(companyId: string): Promise<{ success: boolean }> {
        const company = await this._companyRepository.findById(companyId);
        if (!company) {
            throw new NotFoundError("Company not found");
        }

        const updateData = {
            githubAccessToken: null,
            githubRefreshToken: null,
            githubInstallationId: null,
            githubUsername: null,
            githubOrganization: null,
            githubConnectedAt: null,
        };

        await this._companyRepository.update(companyId, updateData);

        return { success: true };
    }
}
