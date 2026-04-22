import { PROJECT_ROUTES } from "@shared/constants/project.routes.constants";
import { Router } from "express";
import { CreateProjectDTO } from "../../../../application/dtos/projects/create.project.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import type { ProjectController } from "../../../http/controllers/project.controller";
import type { AuthGuard } from "../../middleware/auth.guard";
import { validateDTO } from "../../middleware/validate.dto.middleware";

const router = Router();

const projectController = container.get<ProjectController>(
	PROJECT_TYPE.ProjectController,
);
const authGuard = container.get<AuthGuard>(ADMIN_TYPES.AuthGuard);

router.post(
	PROJECT_ROUTES.CREATE_PROJECT,
	authGuard.authorize(["admin", "lead"]),
	validateDTO(CreateProjectDTO),
	(req, res, next) => projectController.createProject(req, res, next),
);
router.get(
	PROJECT_ROUTES.LIST_PROJECT,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => projectController.listProject(req, res, next),
);
router.patch(
	PROJECT_ROUTES.EDIT_PROJECT,
	authGuard.authorize(["admin","lead"]),
	(req, res, next) => projectController.editProject(req, res, next),
);
router.get(
	PROJECT_ROUTES.PROJECT_DETAIL_PAGE,
	authGuard.authorize(["admin", "developers", "lead"]),
	(req, res, next) => projectController.getProjectDetail(req, res, next),
);

router.patch(
	PROJECT_ROUTES.ADD_MEMBER,
	authGuard.authorize(["lead", "admin"]),
	(req, res, next) => projectController.addMember(req, res, next),
);

export { router as projectRouter };
