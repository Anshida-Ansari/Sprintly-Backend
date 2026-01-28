import { Router } from "express";
import { InviteMemberDTO } from "../../../../application/dtos/admin/invite.member.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import type { AuthGurd } from "../../middleware/auth.gurd";
import { validateDTO } from "../../middleware/validate.dto.middlware";
import type { AdminController } from "../../../http/controllers/admin.controller";

import { ADMIN_ROUTES } from "@shared/constants/admin.routes.constants";

const router = Router();

const adminController = container.get<AdminController>(
	ADMIN_TYPES.AdminController,
);
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	ADMIN_ROUTES.INVITE,
	authGurd.authorize(["admin"]),
	validateDTO(InviteMemberDTO),
	(req, res, next) => adminController.inviteMember(req, res, next),
);

router.get(ADMIN_ROUTES.LIST, authGurd.authorize(["admin"]), (req, res, next) =>
	adminController.listUsers(req, res, next),
);

router.post(ADMIN_ROUTES.VERIFY_INVITATION, (req, res, next) =>
	adminController.verifyInvitation(req, res, next),
);

router.patch(
	ADMIN_ROUTES.BLOCK_USER,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.blockUser(req, res, next),
);

router.get(ADMIN_ROUTES.DASHBOARD, authGurd.authorize(["admin"]), (req, res, next) =>
	adminController.getDashboardStats(req, res, next),
);

export { router as adminRouter };
