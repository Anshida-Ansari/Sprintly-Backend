import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { ANALYTICS_TYPES } from "@infrastructure/di/types/analytics/analytics.types";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import type { AnalyticsController } from "@presentation/http/controllers/analytics.controller";
import { ANALYTICS_ROUTES } from "@shared/constants/analytics.routes.constants";
import { Router } from "express";

const router = Router();

const analyticsController = container.get<AnalyticsController>(
	ANALYTICS_TYPES.AnalyticsController,
);

const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.get(
	ANALYTICS_ROUTES.SPRINT_BURNDOWN,
	authGuard.authorize(["admin", "lead", "developers"]),
	(req, res, next) => analyticsController.getSprintBurndown(req, res, next),
);

router.get(
	ANALYTICS_ROUTES.USER_BURNDOWN,
	authGuard.authorize(["developers", "lead"]),
	(req, res, next) => analyticsController.getUserBurndown(req, res, next),
);

router.get(
	ANALYTICS_ROUTES.DASHBOARD,
	authGuard.authorize(["admin", "lead", "developers"]),
	(req, res, next) => analyticsController.getDashboardAnalytics(req, res, next),
);
router.get(
	ANALYTICS_ROUTES.PROJECT_ANALYTICS,
	authGuard.authorize(["admin", "lead", "developers"]),
	(req, res, next) => analyticsController.getDashboardAnalytics(req, res, next),
);

export { router as analyticsRouter };
