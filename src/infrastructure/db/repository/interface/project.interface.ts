import type { ProjectEntity } from "src/domain/entities/project.entities";
import type { ProjectStatus } from "src/domain/enum/project/project.status";
import type { IBaseRepository } from "../interface/base.repository";

export interface IProjectReposiotory extends IBaseRepository<ProjectEntity> {
	findByUserId(userId: string): Promise<ProjectEntity | null>;
	findByStatus(status: ProjectStatus): Promise<ProjectEntity[]>;
	findByAdminId(adminId: string): Promise<ProjectEntity | null>;
	updateProject(
		id: string,
		project: ProjectEntity,
	): Promise<ProjectEntity | null>;
}
