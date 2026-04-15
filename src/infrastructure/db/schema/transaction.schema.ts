import mongoose from "mongoose";

export const transactionSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
		},
		stripePaymentId: {
			type: String,
			required: true,
			unique: true,
		},
		stripeCustomerId: {
			type: String,
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true, // e.g., 'succeeded', 'failed', 'pending'
		},
		billingReason: {
			type: String, // e.g., 'subscription_create', 'subscription_cycle'
		},
	},
	{
		timestamps: true,
	},
);
