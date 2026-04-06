import type { INotificationReposiotory } from "@infrastructure/db/repository/interface/notification.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { inject, injectable } from "inversify";
import type { IMarkNotificationReadUseCase } from "../interface/mark.notification.read.interface";

@injectable()
export class MarkNotificationReadUseCase
	implements IMarkNotificationReadUseCase
{
	constructor(
		@inject(NOTIFICATION_TYPE.INotificationReposiotory)
		private readonly _notificationRepository: INotificationReposiotory,
	) {}

	async execute(notificationId?: string, userId?: string): Promise<void> {
		if (notificationId) {
			await this._notificationRepository.markAsRead(notificationId);
		} else if (userId) {
			await this._notificationRepository.markAllAsRead(userId);
		} else {
			throw new Error("Must provide notificationId or userId to mark as read");
		}
	}
}
