import type { Document } from "mongoose";

export interface INotification extends Document {
	recipientId: string;
	senderId?: string;
	type: string;
	message: string;
	entityId?: string;
	entityType?: "PROJECT" | "SPRINT" | "STORY" | "SUBTASK" | "MEETING";
	isRead: boolean;
	metadata?: any;
	createdAt: Date;
	updatedAt: Date;
}
