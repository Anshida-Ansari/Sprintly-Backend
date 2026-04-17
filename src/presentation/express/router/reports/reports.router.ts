import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { REPORTS_TYPE } from "@infrastructure/di/types/reports/reports.types";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import type { ReportsController } from "@presentation/http/controllers/reports.controller";
import { REPORTS_ROUTES } from "@shared/constants/reports.routes.constants";
import { Router } from "express";
import { Role } from "@domain/enum/role.enum";

const router = Router();

const reportsController = container.get<ReportsController>(
	REPORTS_TYPE.ReportsController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

// Allow Admin and Lead roles for reports
const authorizeReports = authGurd.authorize([Role.ADMIN, Role.LEAD]);

router.get(
	REPORTS_ROUTES.PROJECTS,
	authorizeReports,
	(req, res, next) => reportsController.getProjectReports(req, res, next),
);

router.get(
	REPORTS_ROUTES.SPRINTS,
	authorizeReports,
	(req, res, next) => reportsController.getSprintReports(req, res, next),
);

router.get(
	REPORTS_ROUTES.USERSTORIES,
	authorizeReports,
	(req, res, next) => reportsController.getUserStoryReports(req, res, next),
);

router.get(
	REPORTS_ROUTES.SUBTASKS,
	authorizeReports,
	(req, res, next) => reportsController.getSubtaskReports(req, res, next),
);

router.get(
	REPORTS_ROUTES.PERFORMANCE,
	authorizeReports,
	(req, res, next) => reportsController.getUserPerformanceReports(req, res, next),
);

export { router as reportsRouter };
