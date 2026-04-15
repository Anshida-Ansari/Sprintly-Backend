export interface IGetCompanySubscriptionUseCase {
	execute(companyId: string): Promise<{
		currentPlan: string;
		projectLimit: number;
		projectCount: number;
		isLimitReached: boolean;
		subscriptionEndDate?: string | null;
		stripeSubscriptionId?: string | null;
	}>;
}
