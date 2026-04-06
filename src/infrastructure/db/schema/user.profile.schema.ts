import mongoose from "mongoose";

export const userProfileSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
			unique: true,
			index: true,
		},
		companyId: {
			type: String,
			required: true,
		},

		phoneNumber: {
			type: String,
			trim: true,
		},

		address: {
			type: String,
			trim: true,
		},

		bio: {
			type: String,
			maxlength: 500,
			trim: true,
		},

		skills: [
			{
				type: String,
				trim: true,
			},
		],

		avatarUrl: {
			type: String,
			trim: true,
		},

		linkedin: {
			type: String,
			trim: true,
		},

		github: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);
