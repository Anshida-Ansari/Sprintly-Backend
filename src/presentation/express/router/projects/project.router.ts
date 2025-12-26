import { Router } from "express";
import { CreateProjectDTO } from "src/application/dtos/projects/create.project.dto";
import { container } from "src/infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "src/infrastructure/di/types/admin/admin.types";
import { PROJECT_TYPE } from "src/infrastructure/di/types/Project/project.types";
import { ProjectController } from "src/presentation/http/controllers/project.controller";
import { AuthGurd } from "src/shared/middleware/auth.gurd";
import { validateDTO } from "src/shared/middleware/validate.dto.middlware";

const router = Router()

const projectController = container.get<ProjectController>(PROJECT_TYPE.ProjectController)
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd)


router.post('/create-project',authGurd.authorize(['admin']),validateDTO(CreateProjectDTO),(req,res,next)=>projectController.createProject(req,res,next))
router.get('/projects',authGurd.authorize(['admin']),(req,res,next)=>projectController.listProject(req,res,next))
router.patch('/update-project/:projectId',authGurd.authorize(['admin']),(req,res,next)=>projectController.editProject(req,res,next))

export {router as projectRouter}