import mongoose from "mongoose";

export const workLogSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		sprintId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Sprints",
			required: true,
		},
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserStory",
			required: true,
		},
		subTaskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubTask",
			required: true,
		},
		hours: {
			type: Number,
			required: true,
			min: [0.1, "Hours must be greater than 0"],
		},
		description: {
			type: String,
			trim: true,
			default: "",
		},
		date: {
			type: Date,
			required: true,
			validate: {
				validator: function(v: Date) {
					return v <= new Date();
				},
				message: "Date cannot be in the future",
			},
		},
	},
	{
		timestamps: true,
	},
);
