import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { AI_TYPES } from "@infrastructure/di/types/ai/ai.types";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import type { AiController } from "@presentation/http/controllers/ai.controller";
import { AI_ROUTES } from "@shared/constants/ai.routes.constants";
import { Router } from "express";

const router = Router();

const aiController = container.get<AiController>(AI_TYPES.AiController);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	AI_ROUTES.CHAT,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => aiController.chat(req, res, next),
);

export { router as aiRouter };
