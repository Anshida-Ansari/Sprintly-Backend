import { AddStandupCommentDTO } from "@application/dtos/standup/add.standup.comment.dto";
import { SubmitStandupDTO } from "@application/dtos/standup/submit.standup.dto";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import type { StandupController } from "@presentation/http/controllers/standup.controller";
import { STANDUP } from "@shared/constants/standup.routes.constants";
import { Router } from "express";

const router = Router();
const standupController = container.get<StandupController>(
	STANDUP_TYPES.StandupController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	STANDUP.SUBMIT_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	validateDTO(SubmitStandupDTO),
	(req, res, next) => standupController.submitStandup(req, res, next),
);
router.post(
	STANDUP.SUBMIT_PROJECT_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	validateDTO(SubmitStandupDTO),
	(req, res, next) => standupController.submitStandup(req, res, next),
);

router.post(
	STANDUP.ADD_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	validateDTO(AddStandupCommentDTO),
	(req, res, next) => standupController.addStandup(req, res, next),
);
router.post(
	STANDUP.ADD_PROJECT_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	validateDTO(AddStandupCommentDTO),
	(req, res, next) => standupController.addStandup(req, res, next),
);

router.get(
	STANDUP.LIST_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => standupController.listStandups(req, res, next),
);
router.get(
	STANDUP.LIST_PROJECT_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => standupController.listStandups(req, res, next),
);

router.post(
	STANDUP.TODAY_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => standupController.getMyTodayStandup(req, res, next),
);
router.post(
	STANDUP.TODAY_PROJECT_STANDUP,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => standupController.getMyTodayStandup(req, res, next),
);

export { router as standupRouter };
