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

router.post(
	"/:projectId/user-stories",
	authGurd.authorize(["admin"]),
	validateDTO(CreateUserStoryDTO),
	(req, res, next) => userstoryController.createUserstory(req, res, next),
);
router.post(
	"/:projectId/user-stories/:userstoryId",
	authGurd.authorize(["admin"]),
	validateDTO(EditUserStoryDTO),
	(req, res, next) => userstoryController.editUserstory(req, res, next),
);
router.get(
	"/:projectId/user-stories",
	authGurd.authorize(["admin","developers"]),
	(req, res, next) => userstoryController.listUserstory(req, res, next),
);
router.post(
	"/:projectId/assign-sprint",
	authGurd.authorize(["admin"]),
	validateDTO(AssignUserStoryToSprintDTO),
	(req, res, next) => userstoryController.assigningToMembers(req, res, next)
)
router.patch(
	"/:userstoryId/status",
	authGurd.authorize(["admin","developers"]),
	(req,res,next)=> userstoryController.updateStatus(req,res,next)

)
export { router as userstoryRouter };
