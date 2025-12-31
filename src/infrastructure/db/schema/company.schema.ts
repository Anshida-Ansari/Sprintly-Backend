import mongoose from "mongoose";
import { Status } from "../../../domain/enum/user/user.status.enum";

export const companySchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
		},
		companyName: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: String,
			enum: Object.values(Status),
			default: Status.PENDING,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);
