import { ConnectGitHubDTO } from "@application/dtos/github/connect.github.dto";
import type { IConnectGitHubUseCase } from "@application/usecases/github/interface/connect.github.interface";
import type { IDisconnectGitHubUseCase } from "@application/usecases/github/interface/disconnect.github.interface";
import type { IGetGitHubStatusUseCase } from "@application/usecases/github/interface/get.github.status.interface";
import type { IGitHubOAuthService } from "@domain/interface/github.oauth.interface";
import { GITHUB_TYPE } from "@infrastructure/di/types/github/github.types";
import { validationError } from "@shared/utils/error-handling/errors/validation.error";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class GitHubController {
	constructor(
		@inject(GITHUB_TYPE.IGitHubOAuthService)
		private _githubOAuthService: IGitHubOAuthService,
		@inject(GITHUB_TYPE.IConnectGitHubUseCase)
		private _connectGitHubUseCase: IConnectGitHubUseCase,
		@inject(GITHUB_TYPE.IGetGitHubStatusUseCase)
		private _getGitHubStatusUseCase: IGetGitHubStatusUseCase,
		@inject(GITHUB_TYPE.IDisconnectGitHubUseCase)
		private _disconnectGitHubUseCase: IDisconnectGitHubUseCase,
	) {}

	async initiateOAuth(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { companyId } = req.user;
			if (!companyId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const state = `${companyId}-${Date.now()}`;

			const authUrl = this._githubOAuthService.getAuthorizationUrl(state);

			res.status(200).json({ authUrl });
		} catch (error) {
			next(error);
		}
	}

	async handleCallback(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const dto = plainToInstance(ConnectGitHubDTO, req.query);
			const errors = await validate(dto);

			if (errors.length > 0) {
				throw new validationError("Validation failed", {
					code: "Code is required",
					state: "State is required",
				});
			}

			const companyId = dto.state.split("-")[0];

			await this._connectGitHubUseCase.execute(dto, companyId);

			const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
			res.redirect(`${frontendUrl}/admin/settings?github=connected`);
		} catch (error) {
			next(error);
		}
	}

	async getStatus(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { companyId } = req.user;
			if (!companyId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const status = await this._getGitHubStatusUseCase.execute(companyId);

			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}

	async disconnect(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const companyId = req.user?.companyId;
			if (!companyId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const result = await this._disconnectGitHubUseCase.execute(companyId);

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
