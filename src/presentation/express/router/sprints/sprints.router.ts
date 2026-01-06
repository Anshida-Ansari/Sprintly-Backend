import { Router } from "express";
import { container } from "src/infrastructure/di/inversify.di";
import { SPRINTS_TYPE } from "src/infrastructure/di/types/spirnts/sprints.types";
import { SprintController } from "src/presentation/http/controllers/sprint.controller";
import { AuthGurd } from "../../middleware/auth.gurd";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { CreateSprintDTO } from "src/application/dtos/sprints/create.sprints.dto";
import { validateDTO } from "../../middleware/validate.dto.middlware";
import { EditSprintDTO } from "src/application/dtos/sprints/edit.sprints.dto";

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

export { router as sprintRouter}

