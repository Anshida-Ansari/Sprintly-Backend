export interface IAddMemberToProjectUseCase {
	execute(
		projectId: string,
		memberId: string,
		companyId: string,
	): Promise<void>;
}
