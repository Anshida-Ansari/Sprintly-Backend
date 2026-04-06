export interface IAiChatUseCase {
	execute(userMessage: string): Promise<string>;
}
