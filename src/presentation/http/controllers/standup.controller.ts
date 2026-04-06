import type { IAddStandupCommentUseCase } from "@application/usecases/standup/interface/add.standup.comment.interface";
import type { IGetTodayStandupUseCase } from "@application/usecases/standup/interface/get.today.standup.interface";
import type { IListStandupsUseCase } from "@application/usecases/standup/interface/list.standup.interface";
import type { ISubmitStandupUseCase } from "@application/usecases/standup/interface/submit.standup.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class StandupController {
	constructor(
		@inject(STANDUP_TYPES.IAddStandupCommentUseCase)
		private _addstandupUseCase: IAddStandupCommentUseCase,
		@inject(STANDUP_TYPES.ISubmitStandupUseCase)
		private _submitStandupUseCase: ISubmitStandupUseCase,
		@inject(STANDUP_TYPES.IListStandupsUseCase)
		private _listStandupUseCase: IListStandupsUseCase,
		@inject(STANDUP_TYPES.IGetTodayStandupUseCase)
		private _getTodayStandupUseCase: IGetTodayStandupUseCase,
	) {}

	async addStandup(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: userId, userName, companyId } = req.user;
			const { projectId, sprintId, standupId } = req.params;

			const result = await this._addstandupUseCase.execute(
				req.body,
				userId,
				userName,
				companyId,
				sprintId,
				projectId,
				standupId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Comment added successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async submitStandup(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: userId, companyId } = req.user;
			const { projectId, sprintId } = req.params;

			await this._submitStandupUseCase.execute(
				req.body,
				userId,
				sprintId,
				projectId,
				companyId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Standup submitted successfully",
			});
		} catch (error) {
			next(error);
		}
	}

	async listStandups(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectId, sprintId } = req.params;
			const date = req.query.date as string; 

			const result = await this._listStandupUseCase.execute(
				projectId,
				sprintId,
				date,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
	async getMyTodayStandup(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: userId } = req.user;
			const { projectId } = req.params;

			const result = await this._getTodayStandupUseCase.execute(
				userId,
				projectId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}
