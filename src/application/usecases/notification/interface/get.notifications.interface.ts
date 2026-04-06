import type { NotificationEntity } from "@domain/entities/notification.entites";

export interface IGetNotificationsUseCase {
	execute(userId: string): Promise<NotificationEntity[]>;
}
