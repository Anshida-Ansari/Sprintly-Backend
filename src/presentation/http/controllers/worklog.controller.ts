import type {
	ICreateWorkLogUseCase,
	IGetAdminWorkLogsUseCase,
	IGetUserWorkLogsUseCase,
} from "@application/usecases/worklog/interface/worklog.usecase.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WorkLogController {
	constructor(
		@inject(WORKLOG_TYPE.ICreateWorkLogUseCase)
		private readonly _createWorkLogUseCase: ICreateWorkLogUseCase,
		@inject(WORKLOG_TYPE.IGetUserWorkLogsUseCase)
		private readonly _getUserWorkLogsUseCase: IGetUserWorkLogsUseCase,
		@inject(WORKLOG_TYPE.IGetAdminWorkLogsUseCase)
		private readonly _getAdminWorkLogsUseCase: IGetAdminWorkLogsUseCase,
	) {}

	async createWorkLog(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id;
			const result = await this._createWorkLogUseCase.execute(userId, req.body);

			return res.status(SuccessStatus.CREATED).json({
				success: true,
				message: "Work log created successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async getMyWorkLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id;
			const filters = req.query;
			const result = await this._getUserWorkLogsUseCase.execute(
				userId,
				filters,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Work logs retrieved successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async getAdminWorkLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const { companyId } = req.user;
			const filters = req.query;
			const result = await this._getAdminWorkLogsUseCase.execute(
				companyId,
				filters,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Admin work log analytics retrieved successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}
