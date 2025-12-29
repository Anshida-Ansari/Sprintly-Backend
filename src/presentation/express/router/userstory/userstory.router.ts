import { Router } from "express";
import { CreateUserStoryDTO } from "src/application/dtos/userstory/create.userstory.dto";
import { EditUserStoryDTO } from "src/application/dtos/userstory/edit.userstory";
import { container } from "src/infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { USERSTORY_TYPE } from "src/infrastructure/di/types/userstory/userstory";
import { UserstoryController } from "src/presentation/http/controllers/userstory.controller";
import { AuthGurd } from "src/shared/middleware/auth.gurd";
import { validateDTO } from "src/shared/middleware/validate.dto.middlware";

const router = Router()

const userstoryController = container.get<UserstoryController>(USERSTORY_TYPE.UserstoryController)
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)

router.post('/:projectId/user-stories',authGurd.authorize(['admin']),validateDTO(CreateUserStoryDTO),(req,res,next)=>userstoryController.createUserstory(req,res,next))
router.post('/:projectId/user-stories/:userstoryId',authGurd.authorize((['admin'])),validateDTO(EditUserStoryDTO),(req,res,next)=>userstoryController.editUserstory(req,res,next))

export {router as userstoryRouter}

