import type { UserStatus } from "../../../../domain/enum/status.enum";

export interface IListMembersUseCase {
	execute(
		companyId: string,
		query: { page: number; limit: number; search?: string },
	): Promise<{
		data: Array<{
			_id: string;
			name: string;
			email: string;
			role: string;
			status: UserStatus;
			createdAt: Date;
		}>;
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
}
