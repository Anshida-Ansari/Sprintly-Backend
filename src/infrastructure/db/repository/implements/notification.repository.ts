import type { NotificationEntity } from "@domain/entities/notification.entites";
import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import { NOTIFICATION_TYPE } from "../../../di/types/notification/notification";
import type { NotificationMapper } from "../../../mappers/notification.mapper";
import type { INotificationReposiotory } from "../interface/notification.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class NotificationRepository
	extends BaseRepository<NotificationEntity>
	implements INotificationReposiotory
{
	constructor(
		@inject(NOTIFICATION_TYPE.NotificationModel)
		model: Model<NotificationEntity>,
		@inject(NOTIFICATION_TYPE.NotificationMapper)
		private readonly _mapper: typeof NotificationMapper,
	) {
		super(model);
	}

	async create(item: NotificationEntity): Promise<NotificationEntity> {
		const rawData = this._mapper.toPersistence(item);
		const createdNotification = await this.model.create(rawData as Record<string, unknown>);
		return this._mapper.toEntity(createdNotification as unknown as Record<string, unknown>);
	}

	async findByRecipient(userId: string): Promise<NotificationEntity[]> {
		const notifications = await this.model
			.find({ recipientId: userId })
			.sort({ createdAt: -1 });
		return notifications.map((n) => this._mapper.toEntity(n as unknown as Record<string, unknown>));
	}

	async markAsRead(notificationId: string): Promise<void> {
		await this.model.findByIdAndUpdate(notificationId, { isRead: true });
	}

	async markAllAsRead(userId: string): Promise<void> {
		await this.model.updateMany({ recipientId: userId } as Record<string, unknown>, {
			isRead: true,
		});
	}

	async findById(id: string): Promise<NotificationEntity | null> {
		const notification = await this.model.findById(id);
		return notification ? this._mapper.toEntity(notification as unknown as Record<string, unknown>) : null;
	}

	async update(
		id: string,
		item: NotificationEntity,
	): Promise<NotificationEntity | null> {
		const rawData = this._mapper.toPersistence(item);
		const updated = await this.model.findByIdAndUpdate(id, rawData as Record<string, unknown>, {
			new: true,
		});
		return updated ? this._mapper.toEntity(updated as unknown as Record<string, unknown>) : null;
	}
}
