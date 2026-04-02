import type { IGetNotificationsUseCase } from "@application/usecases/notification/interface/get.notifications.interface";
import type { IMarkNotificationReadUseCase } from "@application/usecases/notification/interface/mark.notification.read.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationController {
	constructor(
		@inject(NOTIFICATION_TYPE.IGetNotificationsUseCase)
		private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
		@inject(NOTIFICATION_TYPE.IMarkNotificationReadUseCase)
		private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,
	) {}

	async getNotifications(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id;

			const result = await this._getNotificationsUseCase.execute(userId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Notifications listed successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async markAsRead(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const result = await this._markNotificationReadUseCase.execute(
				id,
				undefined,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Notification marked as read successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async markAllAsRead(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id;

			const result = await this._markNotificationReadUseCase.execute(
				undefined,
				userId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "All notifications marked as read successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}
