import { NotificationEntity } from "@domain/entities/notification.entites";
import type { NotificationType } from "@domain/enum/notification/notification.types";
import type { INotification } from "../db/interface/notification.interface";

export const NotificationMapper = {
	toEntity(doc: INotification): NotificationEntity {
		return NotificationEntity.restore({
			id: doc._id as string,
			receiverId: (doc.recipientId as { toString(): string }).toString(),
			senderId: (doc.senderId as { toString(): string })?.toString(),
			type: doc.type as NotificationType,
			message: doc.message as string,
			entityId: (doc.entityId as { toString(): string })?.toString() as string,
			entityType: doc.entityType as string,
			isRead: doc.isRead as boolean,
			meta: doc.metadata as Record<string, unknown>,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	},

	toPersistence(entity: NotificationEntity): Record<string, unknown> {
		return {
			recipientId: entity.receiverId,
			senderId: entity.senderId,
			type: entity.type,
			message: entity.message,
			entityId: entity.entityId,
			entityType: entity.entityType,
			isRead: entity.isRead,
			metadata: entity.meta,
		};
	},
};
