import type { NotificationType } from "@domain/enum/notification/notification.types";

export class NotificationEntity {
	private readonly _id?: string;
	private _receiverId: string;
	private _senderId?: string;
	private _type: NotificationType;
	private _message: string;
	private _entityId: string;
	private _entityType: string;
	private _isRead: boolean;
	private _meta?: Record<string, unknown>;

	private readonly _createdAt: Date;
	private _updatedAt?: Date;

	private constructor(props: {
		id?: string;
		receiverId: string;
		senderId?: string;
		type: NotificationType;
		message: string;
		entityId: string;
		entityType: string;
		isRead?: boolean;
		meta?: Record<string, unknown>;
		createdAt?: Date;
		updatedAt?: Date;
	}) {
		this._id = props.id;
		this._receiverId = props.receiverId;
		this._senderId = props.senderId;
		this._type = props.type;
		this._message = props.message;
		this._entityId = props.entityId;
		this._entityType = props.entityType;
		this._isRead = props.isRead ?? false;
		this._meta = props.meta;

		this._createdAt = props.createdAt || new Date();
		this._updatedAt = props.updatedAt;
	}

	static create(props: {
		id?: string;
		receiverId: string;
		senderId?: string;
		type: NotificationType;
		message: string;
		entityId: string;
		entityType: string;
		meta?: Record<string, unknown>;
	}): NotificationEntity {
		if (!props.receiverId) throw new Error("Receiver ID is required");
		if (!props.type) throw new Error("Notification type is required");
		if (!props.message) throw new Error("Message is required");
		if (!props.entityId) throw new Error("Entity ID is required");
		if (!props.entityType) throw new Error("Entity type is required");

		return new NotificationEntity({
			...props,
			isRead: false,
		});
	}

	static restore(props: {
		id: string;
		receiverId: string;
		senderId?: string;
		type: NotificationType;
		message: string;
		entityId: string;
		entityType: string;
		isRead: boolean;
		meta?: Record<string, unknown>;
		createdAt: Date;
		updatedAt?: Date;
	}): NotificationEntity {
		return new NotificationEntity(props);
	}

	markAsRead() {
		this._isRead = true;
		this._updatedAt = new Date();
	}

	// Getters
	get id() {
		return this._id;
	}

	get receiverId() {
		return this._receiverId;
	}

	get senderId() {
		return this._senderId;
	}

	get type() {
		return this._type;
	}

	get message() {
		return this._message;
	}

	get entityId() {
		return this._entityId;
	}

	get entityType() {
		return this._entityType;
	}

	get isRead() {
		return this._isRead;
	}

	get meta() {
		return this._meta;
	}

	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	toJSON() {
		return {
			id: this._id,
			receiverId: this._receiverId,
			senderId: this._senderId,
			type: this._type,
			message: this._message,
			entityId: this._entityId,
			entityType: this._entityType,
			isRead: this._isRead,
			meta: this._meta,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}
}
