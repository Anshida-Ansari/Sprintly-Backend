import { Router } from "express";
import { container } from "@infrastructure/di/inversify.di";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import type { SprintController } from "@presentation/http/controllers/sprint.controller";
import { CreateSprintDTO } from "@application/dtos/sprints/create.sprints.dto";
import { EditSprintDTO } from "@application/dtos/sprints/edit.sprints.dto";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";

import { SPRINT_ROUTES } from "@shared/constants/sprints.routes.constants";

const router = Router();

const sprintsController = container.get<SprintController>(
	SPRINTS_TYPE.SprintController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	SPRINT_ROUTES.CREATE_SPRINT,
	authGurd.authorize(["admin","lead"]),
	validateDTO(CreateSprintDTO),
	(req, res, next) => sprintsController.createSprints(req, res, next),
);

router.get(
	SPRINT_ROUTES.LIST_SPRINT,
	authGurd.authorize(["admin", "developers","lead"]),
	(req, res, next) => sprintsController.listSprints(req, res, next),
);

router.patch(
	SPRINT_ROUTES.EDIT_SPRINT,
	authGurd.authorize(["admin","lead"]),
	validateDTO(EditSprintDTO),
	(req, res, next) => sprintsController.editSprints(req, res, next),
);

router.patch(
	SPRINT_ROUTES.START_SPRINT,
	authGurd.authorize(["admin","lead"]),
	(req, res, next) => sprintsController.startSprint(req, res, next),
);

router.patch(
	SPRINT_ROUTES.COMPLETE_SPRINT,
	authGurd.authorize(["admin","lead"]),
	(req, res, next) => sprintsController.completeSprint(req, res, next),
);

router.patch(
	SPRINT_ROUTES.DELETE_SPRINT,
	authGurd.authorize(["admin","lead"]),
	(req, res, next) => sprintsController.deleteSprint(req, res, next),
);
export { router as sprintRouter };
