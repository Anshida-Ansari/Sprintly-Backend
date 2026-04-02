import { NotificationEntity } from "@domain/entities/notification.entites";
import { IBaseRepository } from "./base.repository";

export interface INotificationReposiotory extends IBaseRepository<NotificationEntity> {
    create(notification: NotificationEntity): Promise<NotificationEntity>;
    findByRecipient(userId: string): Promise<NotificationEntity[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}