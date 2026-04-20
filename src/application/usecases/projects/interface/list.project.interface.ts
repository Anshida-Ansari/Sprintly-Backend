import type { IProjectWithAnalytics } from "@infrastructure/db/repository/interface/project.interface";

export interface IListProjectUseCase {
	execute(
		query: { page: number; limit: number; search?: string },
		companyId: string,
		userId: string,
		userRole: string,
	): Promise<{
		data: IProjectWithAnalytics[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
