import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { GITHUB_TYPE } from "@infrastructure/di/types/github/github.types";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import { GITHUB_ROUTES } from "../../../../shared/constants/github.routes.constants";
import type { GitHubController } from "../../../http/controllers/github.controller";

const router = Router();
const githubController = container.get<GitHubController>(
	GITHUB_TYPE.GitHubController,
);

const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.get(
	GITHUB_ROUTES.AUTH_INITIATE,
	authGuard.authorize(["admin"]),
	(req, res, next) => githubController.initiateOAuth(req, res, next),
);

// OAuth Callback
router.get(GITHUB_ROUTES.CALLBACK, (req, res, next) =>
	githubController.handleCallback(req, res, next),
);

// Get GitHub Status
router.get(
	GITHUB_ROUTES.STATUS,
	authGuard.authorize(["admin"]),
	(req, res, next) => githubController.getStatus(req, res, next),
);

// Disconnect GitHub
router.post(
	GITHUB_ROUTES.DISCONNECT,
	authGuard.authorize(["admin"]),
	(req, res, next) => githubController.disconnect(req, res, next),
);

export default router;
