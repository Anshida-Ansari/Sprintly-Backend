import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import { MEETING_ROUTES } from "@shared/constants/meeting.routes.constants";
import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import type { MeetingController } from "../../../http/controllers/meeting.controller";

const router = Router();

const meetingController = container.get<MeetingController>(
	MEETING_TYPES.MeetingController,
);

const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	MEETING_ROUTES.SCHEDULE,
	authGuard.authorize(["admin", "lead"]),
	(req, res, next) => meetingController.schedule(req, res, next),
);
router.get(
	MEETING_ROUTES.PROJECT_MEETING,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => meetingController.getProjectMeetings(req, res, next),
);
router.get(
	MEETING_ROUTES.HISTORY,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => meetingController.getHistory(req, res, next),
);
router.patch(
	MEETING_ROUTES.UPDATE_STATUS,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => meetingController.updateStatus(req, res, next),
);

export default router;
