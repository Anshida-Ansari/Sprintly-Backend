export interface IListProjectUseCase {
	execute(
		query: { page: number; limit: number; search?: string },
		companyId: string,
	): Promise<{
		data: any[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
