import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import type { NotificationController } from "@presentation/http/controllers/notification.controller";
import { NOTIFICATION } from "@shared/constants/notification.routes.constants";
import { Router } from "express";

const router = Router();
const notificationController = container.get<NotificationController>(
	NOTIFICATION_TYPE.NotificationController);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.get(
	NOTIFICATION.GET_NOTIFICATIONS,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => notificationController.getNotifications(req, res, next));

router.patch(
	NOTIFICATION.MARK_AS_READ,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => notificationController.markAsRead(req, res, next));

router.patch(
	NOTIFICATION.MARK_ALL_AS_READ,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => notificationController.markAllAsRead(req, res, next));

export { router as notificationRouter };
