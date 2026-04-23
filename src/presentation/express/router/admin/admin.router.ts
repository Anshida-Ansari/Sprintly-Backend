import { ADMIN_ROUTES } from "@shared/constants/admin.routes.constants";
import { Router } from "express";
import { InviteMemberDTO } from "../../../../application/dtos/admin/invite.member.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { SUBSCRIPTION_PLAN_TYPES } from "../../../../infrastructure/di/types/subscription-plan/subscription.plan.types.js";
import type { AdminController } from "../../../http/controllers/admin.controller";
import type { SubscriptionPlanController } from "../../../http/controllers/subscription.plan.controller.js";
import type { AuthGuard } from "../../middleware/auth.guard";
import { validateDTO } from "../../middleware/validate.dto.middleware";

const router = Router();

const adminController = container.get<AdminController>(
	ADMIN_TYPES.AdminController,
);
const subscriptionPlanController = container.get<SubscriptionPlanController>(
	SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanController,
);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	ADMIN_ROUTES.INVITE,
	authGuard.authorize(["admin"]),
	validateDTO(InviteMemberDTO),
	(req, res, next) => adminController.inviteMember(req, res, next),
);

router.get(
	ADMIN_ROUTES.LIST,
	authGuard.authorize(["admin", "lead"]),
	(req, res, next) => adminController.listUsers(req, res, next),
);

router.post(ADMIN_ROUTES.VERIFY_INVITATION, (req, res, next) =>
	adminController.verifyInvitation(req, res, next),
);

router.patch(
	ADMIN_ROUTES.BLOCK_USER,
	authGuard.authorize(["admin"]),
	(req, res, next) => adminController.blockUser(req, res, next),
);

router.get(
	ADMIN_ROUTES.DASHBOARD,
	authGuard.authorize(["admin", "lead"]),
	(req, res, next) => adminController.getDashboardStats(req, res, next),
);

// Subscription endpoints
router.post(
	ADMIN_ROUTES.UPGRADE_PLAN,
	authGuard.authorize(["admin"]),
	(req, res, next) => adminController.upgradePlan(req, res, next),
);

router.post(
	ADMIN_ROUTES.CREATE_STRIPE_SESSION,
	authGuard.authorize(["admin"]),
	(req, res, next) => adminController.createStripeSession(req, res, next),
);
router.post(
	ADMIN_ROUTES.VERIFY_STRIPE_SESSION,
	authGuard.authorize(["admin"]),
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
	authGuard.authorize(["admin"]),
	(req, res, next) => adminController.getSubscriptionStatus(req, res, next),
);

router.get(
	"/subscription-plans/active",
	authGuard.authorize(["admin"]),
	(req, res, next) => {
		req.query.active = "true";
		subscriptionPlanController.listPlans(req, res).catch(next);
	},
);

export { router as adminRouter };
