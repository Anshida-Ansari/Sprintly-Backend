import { AddCommentSubTaskDTO } from "@application/dtos/subtask/add.comment.to.subtask.dto";
import { UpdateSubtaskTimeDTO } from "@application/dtos/subtask/update.subtask.time.dto";
import type { IAddAttachementsUseCase } from "@application/usecases/subtask/interface/add.attachements.interface";
import type { IAddCommentToSubtaskUseCase } from "@application/usecases/subtask/interface/add.comment.to.subtask.interface";
import type { IAssignSubtaskUseCase } from "@application/usecases/subtask/interface/assign.subtask.interface";
import type { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import type { IDeleteSubtaskUseCase } from "@application/usecases/subtask/interface/delete.subtask.interface";
import type { IGenerateDownloadUrlUseCase } from "@application/usecases/subtask/interface/generate.download.url.interface";
import type { IGenerateUploadURLUseCase } from "@application/usecases/subtask/interface/generate.upload.url.interface";
import type { IListSubtasksByStoryUseCase } from "@application/usecases/subtask/interface/list.subtask.interface";
import type { IUpdateSubtaskStatusUseCase } from "@application/usecases/subtask/interface/update.subtask.status.interface";
import type { IUpdateSubtaskTimeUseCase } from "@application/usecases/subtask/interface/update.subtask.time.interface";
import type { Role } from "@domain/enum/role.enum";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class SubTaskController {
	constructor(
		@inject(SUBTASK_TYPE.ICreateSubTaskUseCase)
		private _createSubTaskUseCase: ICreateSubTaskUseCase,
		@inject(SUBTASK_TYPE.IUpdateSubtaskStatusUseCase)
		private _updateSubTaskUseCase: IUpdateSubtaskStatusUseCase,
		@inject(SUBTASK_TYPE.IListSubtasksByStoryUseCase)
		private _listSubtaskUseCase: IListSubtasksByStoryUseCase,
		@inject(SUBTASK_TYPE.IAssignSubtaskUseCase)
		private _assignSubtaskUseCase: IAssignSubtaskUseCase,
		@inject(SUBTASK_TYPE.IDeleteSubtaskUseCase)
		private _delteSubtaskUseCase: IDeleteSubtaskUseCase,
		@inject(SUBTASK_TYPE.IAddCommentToSubtaskUseCase)
		private _addCommentUseCase: IAddCommentToSubtaskUseCase,
		@inject(SUBTASK_TYPE.IUpdateSubtaskTimeUseCase)
		private _updateSubtaskTimeUseCase: IUpdateSubtaskTimeUseCase,
		@inject(SUBTASK_TYPE.IGenerateUploadURLUseCase)
		private _generateurk: IGenerateUploadURLUseCase,
		@inject(SUBTASK_TYPE.IAddAttachementsUseCase)
		private _addAttachmentsUseCase: IAddAttachementsUseCase,
		@inject(SUBTASK_TYPE.IGenerateDownloadUrlUseCase)
		private _generateDownloadUrlUseCase: IGenerateDownloadUrlUseCase,
	) {}

	async generateUploadUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const { fileName, fileType } = req.body;

			const result = await this._generateurk.execute(fileName, fileType);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Upload URL generated successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async downloadUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const fileUrl = req.query.fileUrl as string;

			const result = await this._generateDownloadUrlUseCase.execute(fileUrl);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Download URL generated successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async createSubTask(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId, role } = req.user;
			const { userStoryId } = req.params;

			const result = await this._createSubTaskUseCase.execute(
				req.body,
				companyId,
				userStoryId,
				role,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtask created Successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId, role } = req.user;
			const { subtaskId } = req.params;
			const { status } = req.body;

			const result = await this._updateSubTaskUseCase.execute(
				subtaskId,
				companyId,
				status,
				role as Role,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtask Updated  Successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async listSubtask(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.user;
			const { userStoryId } = req.params;

			const result = await this._listSubtaskUseCase.execute(
				userStoryId,
				companyId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtasks is listed successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async assignMembers(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.user;
			const { subtaskId } = req.params;
			const { developerId } = req.body;

			const result = await this._assignSubtaskUseCase.execute(
				subtaskId,
				developerId,
				companyId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtask is Assigned to developer",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async deleteSubtask(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.user;
			const { subtaskId } = req.params;

			const result = await this._delteSubtaskUseCase.execute(
				subtaskId,
				companyId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtask is deleted Successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async addComment(req: Request, res: Response, next: NextFunction) {
		try {
			const { subtaskId } = req.params;
			const { message } = req.body;
			const userId = req.user.id;
			const userName = req.user.userName || "";

			const dto = new AddCommentSubTaskDTO({
				userId,
				userName,
				subtaskId,
				message,
			});

			const result = await this._addCommentUseCase.execute(dto);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Add Comment Successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateTime(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId, role } = req.user;
			const { subtaskId } = req.params;

			const dto = new UpdateSubtaskTimeDTO();
			dto.estimatedHours = req.body.estimatedHours;
			dto.actualHours = req.body.actualHours;

			const result = await this._updateSubtaskTimeUseCase.execute(
				subtaskId,
				companyId,
				dto,
				role as Role,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Subtask time updated successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async uploadFile(req: Request, res: Response, next: NextFunction) {
		try {
			const { subtaskId } = req.params;
			const { fileUrl, fileName } = req.body;
			const uploadedBy = req.user.id;

			const result = await this._addAttachmentsUseCase.execute(
				subtaskId,
				fileUrl,
				fileName,
				uploadedBy,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Attachment added successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}
