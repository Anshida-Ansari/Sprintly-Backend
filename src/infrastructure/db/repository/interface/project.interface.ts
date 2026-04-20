import type { ProjectEntity } from "../../../../domain/entities/project.entities";
import type { ProjectStatus } from "../../../../domain/enum/project/project.status";
import type { IBaseRepository } from "../interface/base.repository";

export interface IProjectWithAnalytics extends ProjectEntity {
	analytics: {
		totalStories: number;
		completedStories: number;
		progressPercentage: number;
	};
}

export interface IProjectReposiotory extends IBaseRepository<ProjectEntity> {
	findByUserId(userId: string): Promise<ProjectEntity | null>;
	findByStatus(status: ProjectStatus): Promise<ProjectEntity[]>;
	findByAdminId(adminId: string): Promise<ProjectEntity | null>;
	updateProject(
		id: string,
		project: ProjectEntity,
	): Promise<ProjectEntity | null>;
	findWithAnalytics(
		filter: Record<string, unknown>,
		options: { skip: number; limit: number },
	): Promise<IProjectWithAnalytics[]>;
}
