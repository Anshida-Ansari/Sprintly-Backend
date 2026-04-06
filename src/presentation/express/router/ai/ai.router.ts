import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { AI_TYPES } from "@infrastructure/di/types/ai/ai.types";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import type { AiController } from "@presentation/http/controllers/ai.controller";
import { AI_ROUTES } from "@shared/constants/ai.routes.constants";
import { Router } from "express";

const router = Router();

const aiController = container.get<AiController>(AI_TYPES.AiController);
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
  AI_ROUTES.CHAT,
  authGurd.authorize(["admin", "developers", "lead"]),
  (req, res, next) => aiController.chat(req, res, next),
);

export { router as aiRouter };
