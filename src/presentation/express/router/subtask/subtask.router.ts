import { CreateSubTaskDTO } from "@application/dtos/subtask/create.subtask.dto";
import { container } from "@infrastructure/di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/di/types/admin/admin.types";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import type { AuthGurd } from "@presentation/express/middleware/auth.gurd";
import { validateDTO } from "@presentation/express/middleware/validate.dto.middlware";
import type { SubTaskController } from "@presentation/http/controllers/subtask.controller";
import { SUBTASK } from "@shared/constants/subtask.constants";
import { Router } from "express";

const router = Router();
const subtaskController = container.get<SubTaskController>(
	SUBTASK_TYPE.SubTaskController,
);

const authGurd = container.get<AuthGurd>(ADMIN_TYPES.AuthGurd);

router.post(
	SUBTASK.CREATE_SUBTASK,
	authGurd.authorize(["lead", "developers"]),
	validateDTO(CreateSubTaskDTO),
	(req, res, next) => subtaskController.createSubTask(req, res, next),
);

router.patch(
	SUBTASK.UPDATE_STATUS,
	authGurd.authorize(["lead", "developers"]),
	(req, res, next) => subtaskController.updateStatus(req, res, next),
);

router.get(
	SUBTASK.LIST_SUBTASK,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => subtaskController.listSubtask(req, res, next),
);

router.patch(
	SUBTASK.ASSIGN_MEMBER,
	authGurd.authorize(["admin","lead"]),
	(req, res, next) => subtaskController.assignMembers(req, res, next),
);

router.delete(
	SUBTASK.DELETE_SUBTASK,
	authGurd.authorize(["admin", "developers","lead"]),
	(req, res, next) => subtaskController.deleteSubtask(req, res, next),
);
router.post(
	SUBTASK.ADD_COMMENT_SUBTASK,
	authGurd.authorize(["admin", "developers", "lead"]),
	(req, res, next) => subtaskController.addComment(req, res, next),
);
router.patch(
	SUBTASK.UPDATE_TIME,
	authGurd.authorize(["developers", "lead", "admin"]),
	(req, res, next) => subtaskController.updateTime(req, res, next),
);

router.post(
	SUBTASK.UPLOAD_URL,
	authGurd.authorize(["developers", "lead", "admin"]),
	(req, res, next) => subtaskController.generateUploadUrl(req, res, next),
);

router.post(
	SUBTASK.ADD_ATTACHMENT,
	authGurd.authorize(["developers", "lead", "admin"]),
	(req, res, next) => subtaskController.uploadFile(req, res, next),
);

router.get(
	SUBTASK.DOWNLOAD_URL,
	authGurd.authorize(["developers", "lead", "admin"]),
	(req, res, next) => subtaskController.downloadUrl(req, res, next),
);

export { router as subTaskRouter };
