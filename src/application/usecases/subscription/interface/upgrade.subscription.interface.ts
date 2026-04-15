export interface IUpgradeSubscriptionUseCase {
	execute(companyId: string): Promise<{ message: string; currentPlan: string }>;
}
