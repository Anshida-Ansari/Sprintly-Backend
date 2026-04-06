import { SubTaskStatus } from "@domain/enum/subtask/subtask.status";
import mongoose from "mongoose";

export const subTaskSchema = new mongoose.Schema(
	{
		userStoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserStory",
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: Object.values(SubTaskStatus),
			default: SubTaskStatus.PENDING,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
		},
		estimatedHours: {
			type: Number,
			min: 0,
		},
		actualHours: {
			type: Number,
			min: 0,
		},
		comments: [
			{
				userId: {
					type: String,
					required: true,
				},
				userName: {
					type: String,
					default: "",
				},
				message: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		attachments: [
			{
				fileUrl: {
					type: String,
					required: true,
				},
				fileName: {
					type: String,
					required: true,
				},
				uploadedBy: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);
