import type { NotificationEntity } from "@domain/entities/notification.entity";

export interface IGetNotificationsUseCase {
	execute(userId: string): Promise<NotificationEntity[]>;
}
