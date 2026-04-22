import { NotificationEntity } from "@domain/entities/notification.entity";
import type { NotificationType } from "@domain/enum/notification/notification.types";
import type { INotificationSocketService } from "@domain/interface/notification.socket.service.interface";
import type { INotificationRepository } from "@infrastructure/db/repository/interface/notification.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { inject, injectable } from "inversify";
import type { ICreateNotificationUseCase } from "../interface/create.notification.interface";

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
	constructor(
		@inject(NOTIFICATION_TYPE.INotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
		@inject(NOTIFICATION_TYPE.INotificationSocketService)
		private readonly _notificationSocketService: INotificationSocketService,
	) {}

	async execute(
		receiverId: string,
		type: string,
		message: string,
		entityId: string,
		entityType: string,
		senderId?: string,
		metadata?: Record<string, unknown>,
	): Promise<NotificationEntity> {
		const notificationEntity = NotificationEntity.create({
			receiverId,
			type: type as NotificationType,
			message,
			entityId,
			entityType,
			senderId,
			meta: metadata,
		});

		const savedNotification =
			await this._notificationRepository.create(notificationEntity);

		this._notificationSocketService.sendNotification(
			receiverId,
			"new-notification",
			savedNotification,
		);

		return savedNotification;
	}
}
