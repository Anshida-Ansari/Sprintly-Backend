import { NotificationEntity } from "@domain/entities/notification.entites";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { INotification } from "../db/interface/notification.interface";

export class NotificationMapper {
  static toEntity(doc: INotification): NotificationEntity {
    return NotificationEntity.restore({
      id: doc._id as string,
      receiverId: doc.recipientId.toString(),
      senderId: doc.senderId?.toString(),
      type: doc.type as NotificationType,
      message: doc.message,
      entityId: doc.entityId?.toString() as string,
      entityType: doc.entityType as string,
      isRead: doc.isRead,
      meta: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: NotificationEntity): Partial<INotification> {
    return {
      recipientId: entity.receiverId,
      senderId: entity.senderId,
      type: entity.type,
      message: entity.message,
      entityId: entity.entityId,
      entityType: entity.entityType as "PROJECT" | "SPRINT" | "STORY" | "SUBTASK" | "MEETING",
      isRead: entity.isRead,
      metadata: entity.meta,
    };
  }
}
