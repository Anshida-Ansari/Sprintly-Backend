import { AssignUserStoryToSprintDTO } from "@application/dtos/userstory/assign.userstory.to.sprints.dto";
import { CreateUserStoryDTO } from "@application/dtos/userstory/create.userstory.dto";
import { EditUserStoryDTO } from "@application/dtos/userstory/edit.userstory";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import type { AuthGuard } from "@presentation/express/middleware/auth.guard";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middleware";
import type { UserstoryController } from "@presentation/http/controllers/userstory.controller";
import { Router } from "express";

const router = Router();

const userstoryController = container.get<UserstoryController>(
	USERSTORY_TYPE.UserstoryController,
);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

import { USER_STORIES } from "@shared/constants/userstory.routes.constants";

router.post(
	USER_STORIES.CREATE_USERSTORY,
	authGuard.authorize(["admin", "lead"]),
	validateDTO(CreateUserStoryDTO),
	(req, res, next) => userstoryController.createUserstory(req, res, next),
);
router.post(
	USER_STORIES.EDIT_USERSTORY,
	authGuard.authorize(["admin", "lead"]),
	validateDTO(EditUserStoryDTO),
	(req, res, next) => userstoryController.editUserstory(req, res, next),
);
router.get(
	USER_STORIES.LIST_USERSTORY,
	authGuard.authorize(["admin", "lead", "developers"]),
	(req, res, next) => userstoryController.listUserstory(req, res, next),
);
router.post(
	USER_STORIES.ASSIGN_SPRINTS,
	authGuard.authorize(["admin", "lead"]),
	validateDTO(AssignUserStoryToSprintDTO),
	(req, res, next) => userstoryController.assigningToMembers(req, res, next),
);
router.patch(
	USER_STORIES.UPDATE_STATUS,
	authGuard.authorize(["admin", "lead", "developers"]),
	(req, res, next) => userstoryController.updateStatus(req, res, next),
);

router.get(
	USER_STORIES.GET_MY_TASK,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => userstoryController.getMyTasks(req, res, next),
);

router.patch(
	USER_STORIES.ASSIGN_TO_MEMBERS,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => userstoryController.assignUserstory(req, res, next),
);
router.post(
	USER_STORIES.ADD_COMMENT_USERSTORY,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => userstoryController.addComment(req, res, next),
);
export { router as userstoryRouter };
