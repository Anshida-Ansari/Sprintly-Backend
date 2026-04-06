import { Router } from "express";
import { container } from "@infrastructure/di/inversify.di";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import type { WorkLogController } from "@presentation/http/controllers/worklog.controller";
import { WORKLOG } from "@shared/constants/worklog.constants";

const router = Router();

const workLogController = container.get<WorkLogController>(WORKLOG_TYPE.WorkLogController);
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	WORKLOG.CREATE_WORKLOG,
	authGurd.authorize(["developers", "lead"]),
	(req, res, next) => workLogController.createWorkLog(req, res, next)
);

router.get(
	WORKLOG.GET_MY_WORKLOGS,
	authGurd.authorize(["developers", "lead"]),
	(req, res, next) => workLogController.getMyWorkLogs(req, res, next)
);

router.get(
	WORKLOG.GET_ADMIN_WORKLOGS,
	authGurd.authorize(["admin", "lead"]),
	(req, res, next) => workLogController.getAdminWorkLogs(req, res, next)
);

export { router as workLogRouter };
