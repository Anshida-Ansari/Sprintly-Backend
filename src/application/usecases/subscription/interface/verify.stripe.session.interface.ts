export interface IVerifyStripeSessionUseCase {
	execute(
		sessionId: string,
		companyId: string,
	): Promise<{ success: boolean; message: string; currentPlan: string }>;
}
