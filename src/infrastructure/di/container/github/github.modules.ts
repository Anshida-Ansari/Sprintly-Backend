import { GitHubController } from "@presentation/http/controllers/github.controller";
import { ContainerModule } from "inversify";
import { ConnectGitHubUseCase } from "../../../../application/usecases/github/implementation/connect.github.usecase";
import { DisconnectGitHubUseCase } from "../../../../application/usecases/github/implementation/disconnect.github.usecase";
import { GetGitHubStatusUseCase } from "../../../../application/usecases/github/implementation/get.github.status.usecase";
import type { IConnectGitHubUseCase } from "../../../../application/usecases/github/interface/connect.github.interface";
import type { IDisconnectGitHubUseCase } from "../../../../application/usecases/github/interface/disconnect.github.interface";
import type { IGetGitHubStatusUseCase } from "../../../../application/usecases/github/interface/get.github.status.interface";
import type { IGitHubOAuthService } from "../../../../domain/interface/github.oauth.interface";
import type { IGitHubRepositoryService } from "../../../../domain/interface/github.repository.interface";
import { GitHubOAuthService } from "../../../providers/github/github.oauth.service";
import { GitHubRepositoryService } from "../../../providers/github/github.repository.service";
import { GITHUB_TYPE } from "../../types/github/github.types";

export const GitHubModule = new ContainerModule(({ bind }) => {
	bind<IGitHubOAuthService>(GITHUB_TYPE.IGitHubOAuthService).to(
		GitHubOAuthService,
	);

	bind<IGitHubRepositoryService>(GITHUB_TYPE.IGitHubRepositoryService).to(
		GitHubRepositoryService,
	);

	bind<IConnectGitHubUseCase>(GITHUB_TYPE.IConnectGitHubUseCase).to(
		ConnectGitHubUseCase,
	);

	bind<IDisconnectGitHubUseCase>(GITHUB_TYPE.IDisconnectGitHubUseCase).to(
		DisconnectGitHubUseCase,
	);

	bind<IGetGitHubStatusUseCase>(GITHUB_TYPE.IGetGitHubStatusUseCase).to(
		GetGitHubStatusUseCase,
	);

	bind<GitHubController>(GITHUB_TYPE.GitHubController).to(GitHubController);
});
