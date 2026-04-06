import type { NotificationEntity } from "@domain/entities/notification.entites";
import type { INotificationReposiotory } from "@infrastructure/db/repository/interface/notification.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { inject, injectable } from "inversify";
import type { IGetNotificationsUseCase } from "../interface/get.notifications.interface";

@injectable()
export class GetNotificationsUseCase implements IGetNotificationsUseCase {
	constructor(
		@inject(NOTIFICATION_TYPE.INotificationReposiotory)
		private readonly _notificationRepository: INotificationReposiotory,
	) {}

	async execute(userId: string): Promise<NotificationEntity[]> {
		return await this._notificationRepository.findByRecipient(userId);
	}
}
