import { SUPERADMIN_ROUTES } from "@shared/constants/superadmin.routes.constants";
import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { SUPERADMIN_TYPES } from "../../../../infrastructure/di/types/superadmin/superadmin.types";
import type { SuperAdminController } from "../../../http/controllers/superadmin.controller";
import type { AuthGurd } from "../../middleware/auth.gurd";

const router = Router();

const superadminController = container.get<SuperAdminController>(
	SUPERADMIN_TYPES.SuperAdminController,
);
const authGuard = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.get(
	SUPERADMIN_ROUTES.LIST_COMPANIES,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.listCompanies(req, res, next),
);
router.patch(
	SUPERADMIN_ROUTES.UPDATE_STATUS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.updateStatus(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.DETAIL_PAGE,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getDetailPage(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.DASHBOARD_STATS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getDashboardStats(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.SUBSCRIPTION_ANALYTICS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) =>
		superadminController.getSubscriptionAnalytics(req, res, next),
);

// Analytics
router.get(
	SUPERADMIN_ROUTES.REVENUE_ANALYTICS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getRevenueAnalytics(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.SUBSCRIPTION_METRICS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) =>
		superadminController.getSubscriptionMetrics(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.TOP_COMPANIES,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getTopCompanies(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.PLATFORM_ANALYTICS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getPlatformAnalytics(req, res, next),
);

// Reports
router.get(
	SUPERADMIN_ROUTES.REPORT_SUBSCRIPTIONS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) =>
		superadminController.getSubscriptionReport(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.REPORT_PAYMENTS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getPaymentReport(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.REPORT_EXPIRING,
	authGuard.authorize(["superadmin"]),
	(req, res, next) =>
		superadminController.getExpiringSoonReport(req, res, next),
);
router.get(
	SUPERADMIN_ROUTES.REPORT_TRIALS,
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getTrialReport(req, res, next),
);

export { router as superadminRouter };
