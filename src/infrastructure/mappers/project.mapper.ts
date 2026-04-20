import type { ProjectStatus } from "@domain/enum/project/project.status";
import { ProjectEntity } from "../../domain/entities/project.entity";

export class ProjectPersistanceMapper {
	toMongo(project: ProjectEntity) {
		return {
			name: project.name,
			description: project.description,
			status: project.status,
			startDate: project.startDate,
			endDate: project.endDate,
			createdBy: project.createdBy,
			companyId: project.companyId,
			members: project.members,
			gitRepoUrl: project.gitRepoUrl,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): ProjectEntity {
		const members = (doc.members as unknown[]) || [];
		return ProjectEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			name: doc.name as string,
			description: doc.description as string,
			status: doc.status as ProjectStatus,
			startDate: doc.startDate as Date,
			endDate: doc.endDate as Date,
			createdBy: (doc.createdBy as { toString(): string }).toString(),
			companyId: (doc.companyId as { toString(): string }).toString(),
			members: members.map((m) => (m as { toString(): string }).toString()),
			gitRepoUrl: doc.gitRepoUrl as string,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	}
}
