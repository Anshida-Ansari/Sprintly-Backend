import type { ProjectStatus } from "src/domain/enum/project/project.status";

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
		members?: string[];
		createdAt: Date;
		updatedAt: Date;
	}>;
}
