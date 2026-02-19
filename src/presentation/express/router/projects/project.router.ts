import { PROJECT_ROUTES } from "@shared/constants/project.routes.constants";
import { Router } from "express";
import { CreateProjectDTO } from "../../../../application/dtos/projects/create.project.dto";
import { container } from "../../../../infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "../../../../infrastructure/di/types/admin/admin.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import type { ProjectController } from "../../../http/controllers/project.controller";
import type { AuthGurd } from "../../middleware/auth.gurd";
import { validateDTO } from "../../middleware/validate.dto.middlware";

const router = Router();

const projectController = container.get<ProjectController>(
	PROJECT_TYPE.ProjectController,
);
const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	PROJECT_ROUTES.CREATE_PROJECT,
	authGurd.authorize(["admin"]),
	validateDTO(CreateProjectDTO),
	(req, res, next) => projectController.createProject(req, res, next),
);
router.get(
	PROJECT_ROUTES.LIST_PROJECT,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => projectController.listProject(req, res, next),
);
router.patch(
	PROJECT_ROUTES.EDIT_PROJECT,
	authGurd.authorize(["admin"]),
	(req, res, next) => projectController.editProject(req, res, next),
);
router.get(
	PROJECT_ROUTES.PROJECT_DETAIL_PAGE,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => projectController.getProjectDetail(req, res, next),
);

router.patch(
	PROJECT_ROUTES.ADD_MEMBER,
	authGurd.authorize(["lead", "admin"]),
	(req, res, next) => projectController.addMember(req, res, next),
);

export { router as projectRouter };
