import mongoose from "mongoose";

export const subscriptionPlanSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		stripePriceId: {
			type: String,
			default: null,
		},
		projectLimit: {
			type: Number,
			required: true,
			default: -1, // -1 means unlimited
		},
		features: [
			{
				text: { type: String, required: true },
				included: { type: Boolean, required: true },
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
		isPopular: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

export const SubscriptionPlanModel = mongoose.model(
	"SubscriptionPlan",
	subscriptionPlanSchema,
);
