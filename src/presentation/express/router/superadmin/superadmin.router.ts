import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { SUPERADMIN_TYPES } from "../../../../infrastructure/di/types/superadmin/superadmin.types";
import type { AuthGurd } from "../../middleware/auth.gurd";
import type { SuperAdminController } from "../../../http/controllers/superadmin.controller";

const router = Router();

const superadminController = container.get<SuperAdminController>(
	SUPERADMIN_TYPES.SuperAdminController,
);
const authGuard = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.get(
	"/companies",
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.listCompanies(req, res, next),
);
router.patch(
	"/company/:companyId/status",
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.updateStatus(req, res, next),
);
router.get(
	"/company/:companyId",
	authGuard.authorize(["superadmin"]),
	(req, res, next) => superadminController.getDetailPage(req, res, next),
);

export { router as superadminRouter };
