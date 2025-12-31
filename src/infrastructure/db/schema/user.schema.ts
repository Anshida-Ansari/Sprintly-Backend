import mongoose from "mongoose";
import { Role } from "../../../domain/enum/role.enum";
import { UserStatus } from "../../../domain/enum/status.enum";
import { Status } from "../../../domain/enum/user/user.status.enum";

export const userSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(Role),
			default: Role.DEVELOPERS,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(UserStatus),
			default: UserStatus.ACTIVE,
		},
		performanceScore: {
			type: Number,
			default: 0,
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},
		projects: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Project",
			},
		],
		notificationPreferences: {
			emailNotification: {
				type: Boolean,
				// default: true,
			},
			pushNotification: {
				type: Boolean,
				// default: true,
			},
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Companies",
			required: function (this: any) {
				return this.role !== Role.SUPER_ADMIN;
			},
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: function (this: any) {
				return this.role === Role.DEVELOPERS;
			},
			index: true,
		},
	},

	{
		timestamps: true,
	},
);
