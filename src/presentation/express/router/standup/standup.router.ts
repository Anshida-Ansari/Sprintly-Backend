import { AddStandupCommentDTO } from "@application/dtos/standup/add.standup.comment.dto";
import { SubmitStandupDTO } from "@application/dtos/standup/submit.standup.dto";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middleware";
import type { StandupController } from "@presentation/http/controllers/standup.controller";
import { STANDUP } from "@shared/constants/standup.routes.constants";
import { Router } from "express";

const router = Router();
const standupController = container.get<StandupController>(
	STANDUP_TYPES.StandupController,
);

const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	STANDUP.SUBMIT_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	validateDTO(SubmitStandupDTO),
	(req, res, next) => standupController.submitStandup(req, res, next),
);
router.post(
	STANDUP.SUBMIT_PROJECT_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	validateDTO(SubmitStandupDTO),
	(req, res, next) => standupController.submitStandup(req, res, next),
);

router.post(
	STANDUP.ADD_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	validateDTO(AddStandupCommentDTO),
	(req, res, next) => standupController.addStandup(req, res, next),
);
router.post(
	STANDUP.ADD_PROJECT_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	validateDTO(AddStandupCommentDTO),
	(req, res, next) => standupController.addStandup(req, res, next),
);

router.get(
	STANDUP.LIST_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	(req, res, next) => standupController.listStandups(req, res, next),
);
router.get(
	STANDUP.LIST_PROJECT_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	(req, res, next) => standupController.listStandups(req, res, next),
);

router.post(
	STANDUP.TODAY_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	(req, res, next) => standupController.getMyTodayStandup(req, res, next),
);
router.post(
	STANDUP.TODAY_PROJECT_STANDUP,
	authGuard.authorize(["admin", "developers","lead"]),
	(req, res, next) => standupController.getMyTodayStandup(req, res, next),
);

export { router as standupRouter };
