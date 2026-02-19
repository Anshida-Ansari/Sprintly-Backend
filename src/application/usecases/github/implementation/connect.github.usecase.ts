import type { IGitHubOAuthService } from "@domain/interface/github.oauth.interface";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { GITHUB_TYPE } from "@infrastructure/di/types/github/github.types";
import { EncryptionUtil } from "@shared/utils/encryption/encryption.util";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { ConnectGitHubDTO } from "../../../dtos/github/connect.github.dto";
import type { GitHubStatusResponse } from "../../../dtos/github/github.status.response";
import type { IConnectGitHubUseCase } from "../interface/connect.github.interface";

@injectable()
export class ConnectGitHubUseCase implements IConnectGitHubUseCase {
	constructor(
		@inject(GITHUB_TYPE.IGitHubOAuthService)
		private _githubOAuthService: IGitHubOAuthService,
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute(
		dto: ConnectGitHubDTO,
		companyId: string,
	): Promise<GitHubStatusResponse> {
		const company = await this._companyRepository.findById(companyId);
		if (!company) {
			throw new NotFoundError("Company not found");
		}
		const tokens = await this._githubOAuthService.exchangeCodeForToken(
			dto.code,
		);

		const userInfo = await this._githubOAuthService.getUserInfo(
			tokens.accessToken,
		);

		const encryptionKey = process.env.ENCRYPTION_KEY;
		if (!encryptionKey) {
			throw new Error("ENCRYPTION_KEY not configured in environment variables");
		}

		const encryptedAccessToken = EncryptionUtil.encrypt(
			tokens.accessToken,
			encryptionKey,
		);
		const encryptedRefreshToken = tokens.refreshToken
			? EncryptionUtil.encrypt(tokens.refreshToken, encryptionKey)
			: undefined;

		const companyData = {
			githubAccessToken: encryptedAccessToken,
			githubRefreshToken: encryptedRefreshToken,
			githubUsername: userInfo.username,
			githubOrganization: userInfo.organization,
			githubConnectedAt: new Date(),
		};

		await this._companyRepository.update(companyId, companyData);

		return {
			isConnected: true,
			githubUsername: userInfo.username,
			githubOrganization: undefined,
			connectedAt: new Date(),
		};
	}
}
