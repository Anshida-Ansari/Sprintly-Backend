import type { CompanyEntity } from "@domain/entities/company.entity";

export interface IListCompanyUseCase {
	execute(query: { page: number; limit: number; search?: string }): Promise<{
		data: CompanyEntity[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
