import { Router } from "express";
import { container } from "@infrastructure/di/inversify.di";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import type { SprintController } from "@presentation/http/controllers/sprint.controller";
import { CreateSprintDTO } from "@application/dtos/sprints/create.sprints.dto";
import { EditSprintDTO } from "@application/dtos/sprints/edit.sprints.dto";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";

const router = Router()

const sprintsController = container.get<SprintController>(
    SPRINTS_TYPE.SprintController
)

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)

router.post(
    "/:projectId/sprints",
    authGurd.authorize(["admin"]),
    validateDTO(CreateSprintDTO),
    (req,res,next)=> sprintsController.createSprints(req,res,next)

)

router.get(
    "/:projectId/sprints",
    authGurd.authorize(["admin"]),
    (req,res,next)=>sprintsController.listSprints(req,res,next)
)

router.patch(
    "/:projectId/sprints/:sprintId",
    authGurd.authorize(['admin']),
    validateDTO(EditSprintDTO),
    (req,res,next)=>sprintsController.editSprints(req,res,next)
)

router.patch(
    "/:sprintId/start",
    authGurd.authorize(["admin"]),
    (req,res,next)=>sprintsController.startSprint(req,res,next)
)
export { router as sprintRouter}

