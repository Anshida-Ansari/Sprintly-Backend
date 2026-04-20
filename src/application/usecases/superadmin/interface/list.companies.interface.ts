import type { CompanyEnitiy } from "@domain/entities/company.enities";

export interface IListCompanyUseCase {
	execute(query: { page: number; limit: number; search?: string }): Promise<{
		data: CompanyEnitiy[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
