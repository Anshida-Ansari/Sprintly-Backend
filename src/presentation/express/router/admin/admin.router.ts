import { ADMIN_ROUTES } from "@shared/constants/admin.routes.constants";
import { Router } from "express";
import { InviteMemberDTO } from "../../../../application/dtos/admin/invite.member.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import type { AdminController } from "../../../http/controllers/admin.controller";
import type { AuthGurd } from "../../middleware/auth.gurd";
import { validateDTO } from "../../middleware/validate.dto.middlware";

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

router.get(
	ADMIN_ROUTES.LIST,
	authGurd.authorize(["admin", "lead"]),
	(req, res, next) => adminController.listUsers(req, res, next),
);

router.post(ADMIN_ROUTES.VERIFY_INVITATION, (req, res, next) =>
	adminController.verifyInvitation(req, res, next),
);

router.patch(
	ADMIN_ROUTES.BLOCK_USER,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.blockUser(req, res, next),
);

router.get(
	ADMIN_ROUTES.DASHBOARD,
	authGurd.authorize(["admin", "lead"]),
	(req, res, next) => adminController.getDashboardStats(req, res, next),
);

// Subscription endpoints
router.post(
	ADMIN_ROUTES.UPGRADE_PLAN,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.upgradePlan(req, res, next),
);

router.post(
	ADMIN_ROUTES.CREATE_STRIPE_SESSION,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.createStripeSession(req, res, next),
);
router.post(
	ADMIN_ROUTES.VERIFY_STRIPE_SESSION,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.verifyStripeSession(req, res, next),
);

import express from "express";

router.post(
	ADMIN_ROUTES.STRIPE_WEBHOOK,
	express.raw({ type: "application/json" }), // Required to get the raw buffer for Stripe signature verification
	(req, res, next) => adminController.stripeWebhook(req, res, next),
);

router.get(
	ADMIN_ROUTES.GET_SUBSCRIPTION_STATUS,
	authGurd.authorize(["admin"]),
	(req, res, next) => adminController.getSubscriptionStatus(req, res, next),
);

export { router as adminRouter };
