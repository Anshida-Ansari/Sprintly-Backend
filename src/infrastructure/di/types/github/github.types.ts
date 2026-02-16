import { GitHubController } from "@presentation/http/controllers/github.controller";

export const GITHUB_TYPE = {
    IGitHubOAuthService: Symbol.for("IGitHubOAuthService"),
    IGitHubRepositoryService: Symbol.for("IGitHubRepositoryService"),
    IConnectGitHubUseCase: Symbol.for("IConnectGitHubUseCase"),
    IDisconnectGitHubUseCase: Symbol.for("IDisconnectGitHubUseCase"),
    IGetGitHubStatusUseCase: Symbol.for("IGetGitHubStatusUseCase"),
    GitHubController: Symbol.for('GitHubController')
};
