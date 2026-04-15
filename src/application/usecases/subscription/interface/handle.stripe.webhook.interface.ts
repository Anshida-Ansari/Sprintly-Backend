export interface IHandleStripeWebhookUseCase {
	execute(rawBody: Buffer, signature: string): Promise<void>;
}
