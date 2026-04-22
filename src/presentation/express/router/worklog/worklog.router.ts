import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import type { WorkLogController } from "@presentation/http/controllers/worklog.controller";
import { WORKLOG } from "@shared/constants/worklog.constants";
import { Router } from "express";

const router = Router();

const workLogController = container.get<WorkLogController>(
	WORKLOG_TYPE.WorkLogController,
);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	WORKLOG.CREATE_WORKLOG,
	authGuard.authorize(["developers", "lead"]),
	(req, res, next) => workLogController.createWorkLog(req, res, next),
);

router.get(
	WORKLOG.GET_MY_WORKLOGS,
	authGuard.authorize(["developers", "lead"]),
	(req, res, next) => workLogController.getMyWorkLogs(req, res, next),
);

router.get(
	WORKLOG.GET_ADMIN_WORKLOGS,
	authGuard.authorize(["admin", "lead"]),
	(req, res, next) => workLogController.getAdminWorkLogs(req, res, next),
);

export { router as workLogRouter };
