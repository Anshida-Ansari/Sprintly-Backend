import { Router } from "express";
import { container } from "../../../../infrastructure/di/inversify.di";
import type { MeetingController } from "../../../http/controllers/meeting.controller";
import { MEETING_TYPES } from "../../../../infrastructure/di/types/meeting/meeting.types";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";

const router = Router();

const meetingController = container.get<MeetingController>(
	MEETING_TYPES.MeetingController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post("/", authGurd.authorize(["admin"]), (req, res, next) =>
	meetingController.schedule(req, res, next),
);
router.get(
	"/project/:projectId",
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => meetingController.getProjectMeetings(req, res, next),
);
router.patch(
	"/:id/status",
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => meetingController.updateStatus(req, res, next),
);

export default router;
