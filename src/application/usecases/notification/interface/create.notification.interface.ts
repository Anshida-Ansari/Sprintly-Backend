import type { NotificationEntity } from "@domain/entities/notification.entity";

export interface ICreateNotificationUseCase {
	execute(
		receiverId: string,
		type: string,
		message: string,
		entityId: string,
		entityType: string,
		senderId?: string,
		metadata?: Record<string, unknown>,
	): Promise<NotificationEntity>;
}
