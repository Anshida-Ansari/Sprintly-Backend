export interface IDisconnectGitHubUseCase {
	execute(companyId: string): Promise<{ success: boolean }>;
}
