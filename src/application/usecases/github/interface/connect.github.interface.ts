import type { ConnectGitHubDTO } from "../../../dtos/github/connect.github.dto";
import type { GitHubStatusResponse } from "../../../dtos/github/github.status.response";

export interface IConnectGitHubUseCase {
	execute(
		dto: ConnectGitHubDTO,
		companyId: string,
	): Promise<GitHubStatusResponse>;
}
