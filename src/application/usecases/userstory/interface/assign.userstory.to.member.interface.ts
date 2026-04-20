export interface IAssignUserStoryUseCase {
	execute(
		userStoryId: string,
		developerId: string,
		companyId: string,
	): Promise<UserStoryEntity>;
}
