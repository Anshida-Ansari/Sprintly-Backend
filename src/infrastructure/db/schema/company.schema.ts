import mongoose from "mongoose";
import { SubscriptionPlan } from "../../../domain/enum/company/subscription.plan.enum";
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
		githubAccessToken: {
			type: String,
			default: null,
		},
		githubRefreshToken: {
			type: String,
			default: null,
		},
		githubInstallationId: {
			type: String,
			default: null,
		},
		githubConnectedAt: {
			type: Date,
			default: null,
		},
		githubUsername: {
			type: String,
			default: null,
		},
		githubOrganization: {
			type: String,
			default: null,
		},
		currentPlan: {
			type: String,
			enum: Object.values(SubscriptionPlan),
			default: SubscriptionPlan.FREE,
		},
		projectLimit: {
			type: Number,
			default: 2, // Free plan: 2 projects max
		},
		stripeCustomerId: {
			type: String,
			default: null,
		},
		stripeSubscriptionId: {
			type: String,
			default: null,
		},
		subscriptionEndDate: {
			type: Date,
			default: null,
		},
		autoRenew: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);
