import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import type { MeetingController } from "../../../http/controllers/meeting.controller";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";

import { MEETING_ROUTES } from "@shared/constants/meeting.routes.constants";

const router = Router();

const meetingController = container.get<MeetingController>(
	MEETING_TYPES.MeetingController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(MEETING_ROUTES.SCHEDULE, authGurd.authorize(["admin"]), (req, res, next) =>
	meetingController.schedule(req, res, next),
);
router.get(
	MEETING_ROUTES.PROJECT_MEETING,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => meetingController.getProjectMeetings(req, res, next),
);
router.patch(
	MEETING_ROUTES.UPDATE_STATUS,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => meetingController.updateStatus(req, res, next),
);

export default router;
