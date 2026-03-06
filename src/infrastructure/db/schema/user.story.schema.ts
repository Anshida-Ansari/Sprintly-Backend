import mongoose from "mongoose";
import { PriorityStatus } from "../../../domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "../../../domain/enum/userstory/user.story.status";

export const userStorySchema = new mongoose.Schema(
	{
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		assignedTo: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Users",
			},
		],
		comments: [
			{
				userId: {
					type: String,
					required: true
				},
				message: {
					type: String,
					required: true
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		description: {
			type: String,
			default: "",
			trim: true,
		},
		status: {
			type: String,
			enum: Object.values(UserStoryStatus),
			default: UserStoryStatus.IN_PENDING,
		},
		priority: {
			type: String,
			enum: Object.values(PriorityStatus),
			default: PriorityStatus.MEDIUM,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Companies",
			required: true,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
		},
		sprintId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprints",
		},
		estimationPoints: {
			type: Number,
			default: 0,
		},
		acceptanceCriteria: [
			{
				type: String,
				trim: true,
			},
		],
	},
	{
		timestamps: true,
	},
);
