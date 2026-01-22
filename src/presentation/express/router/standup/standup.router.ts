import { AddStandupCommentDTO } from "@application/dtos/standup/add.standup.comment.dto";
import { SubmitStandupDTO } from "@application/dtos/standup/submit.standup.dto";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import { StandupController } from "@presentation/http/controllers/standup.controller";
import { Router } from "express";

import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";

const router = Router()
const standupController = container.get<StandupController>(
    STANDUP_TYPES.StandupController
)

const authGurd = container.get<AuthGurd>(
    ADMIN_TYPES.AuthGurd
)

router.post(
    "/:projectId/:sprintId/standups",
    authGurd.authorize(["admin", "developers"]),
    validateDTO(SubmitStandupDTO),
    (req, res, next) => standupController.submitStandup(req, res, next)
);

router.post(
    "/:projectId/:sprintId/standups/:standupId/comments",
    authGurd.authorize(["admin", "developers"]),
    validateDTO(AddStandupCommentDTO),
    (req, res, next) => standupController.addStandup(req, res, next)

);

router.get(
    "/:projectId/:sprintId/standups",
    authGurd.authorize(["admin", "developers"]),
    (req, res, next) => standupController.listStandups(req, res, next)
)

router.post(
    "/:projectId/:sprintId/standups/today",
    authGurd.authorize(["admin", "developers"]),
    (req, res, next) => standupController.getMyTodayStandup(req, res, next)
)


export { router as standupRouter }