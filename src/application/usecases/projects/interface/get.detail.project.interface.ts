import type { ProjectStatus } from "@domain/enum/project/project.status";

export interface IGetDetailProjectUseCase {
	execute(
		companyId: string,
		proejctId: string,
	): Promise<{
		id: string;
		name: string;
		description?: string;
		status: ProjectStatus;
		startDate?: Date;
		endDate?: Date;
		gitRepoUrl?: string;
		members?: {
			id: string;
			name: string;
			email: string;
			role: string;
		}[];
		createdAt: Date;
		updatedAt: Date;
		activeSprintId?: string;
	}>;
}
