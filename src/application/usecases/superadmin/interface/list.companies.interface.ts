export interface IListCompanyUseCase {
	execute(query: { page: number; limit: number; search?: string }): Promise<{
		data: any[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
