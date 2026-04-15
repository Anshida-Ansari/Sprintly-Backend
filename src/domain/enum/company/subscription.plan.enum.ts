export enum SubscriptionPlan {
	FREE = "free",
	PRO = "pro",
}

export const PROJECT_LIMITS = {
	[SubscriptionPlan.FREE]: 2,
	[SubscriptionPlan.PRO]: -1, // -1 means unlimited
} as const;
