import { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import { SubTaskController } from "@presentation/http/controllers/subtask.controller";
import { Router } from "express";

const router = Router()
const subtaskController = container.get<SubTaskController>(
    SUBTASK_TYPE.SubTaskController,
)

const authGurd = container.get<AuthGurd>(
    ADMIN_TYPES.AuthGurd
)

router.post(
    '/:userStoryId/subtask',
    authGurd.authorize(["admin"]),
    validateDTO(CreateSubTaskDTO),
    (req,res,next)=> subtaskController.createSubTask(req,res,next)
)

export {router as subTaskRouter}