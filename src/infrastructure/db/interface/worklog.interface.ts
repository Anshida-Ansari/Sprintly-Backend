import type { Document, Schema } from "mongoose";

export interface IWorkLog extends Document {
	userId: Schema.Types.ObjectId | string;
	projectId: Schema.Types.ObjectId | string;
	sprintId: Schema.Types.ObjectId | string;
	taskId: Schema.Types.ObjectId | string;
	subTaskId: Schema.Types.ObjectId | string;
	hours: number;
	description: string;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}
