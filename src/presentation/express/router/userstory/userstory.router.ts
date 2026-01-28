import { Router } from "express";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { USERSTORY_TYPE } from "@infrastructure/di/types/userstory/userstory";
import { CreateUserStoryDTO } from "@application/dtos/userstory/create.userstory.dto";
import { EditUserStoryDTO } from "@application/dtos/userstory/edit.userstory";
import type { UserstoryController } from "@presentation/http/controllers/userstory.controller";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import { AssignUserStoryToSprintDTO } from "@application/dtos/userstory/assign.userstory.to.sprints.dto";
const router = Router();

const userstoryController = container.get<UserstoryController>(
	USERSTORY_TYPE.UserstoryController,
);
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

import { USER_STORIES } from "@shared/constants/userstory.routes.constants";

router.post(
	USER_STORIES.CREATE_USERSTORY,
	authGurd.authorize(["admin"]),
	validateDTO(CreateUserStoryDTO),
	(req, res, next) => userstoryController.createUserstory(req, res, next),
);
router.post(
	USER_STORIES.EDIT_USERSTORY,
	authGurd.authorize(["admin"]),
	validateDTO(EditUserStoryDTO),
	(req, res, next) => userstoryController.editUserstory(req, res, next),
);
router.get(
	USER_STORIES.LIST_USERSTORY,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => userstoryController.listUserstory(req, res, next),
);
router.post(
	USER_STORIES.ASSIGN_MEMBERS,
	authGurd.authorize(["admin"]),
	validateDTO(AssignUserStoryToSprintDTO),
	(req, res, next) => userstoryController.assigningToMembers(req, res, next),
);
router.patch(
	USER_STORIES.UPDATE_STATUS,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => userstoryController.updateStatus(req, res, next),
);

router.get(
	USER_STORIES.GET_MY_TASK,
	authGurd.authorize(["admin", "developers"]),
	(req, res, next) => userstoryController.getMyTasks(req, res, next),
);

export { router as userstoryRouter };
