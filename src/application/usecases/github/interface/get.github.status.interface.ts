import type { GitHubStatusResponse } from "../../../dtos/github/github.status.response";

export interface IGetGitHubStatusUseCase {
    execute(companyId: string): Promise<GitHubStatusResponse>;
}
