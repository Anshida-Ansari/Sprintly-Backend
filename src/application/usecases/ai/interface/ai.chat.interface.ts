export interface IAiChatUseCase {
	execute(userMessage: string, context?: { companyId?: string; projectId?: string; userId?: string }): Promise<string>;
}
