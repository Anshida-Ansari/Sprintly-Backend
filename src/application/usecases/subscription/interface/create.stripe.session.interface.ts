export interface ICreateStripeSessionUseCase {
	execute(
		companyId: string,
		priceId: string,
		successUrl?: string,
		cancelUrl?: string,
	): Promise<{ url: string | null; sessionId: string }>;
}
