import { ProjectEntity } from "src/domain/entities/project.entities";

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

	fromMongo(doc: any): ProjectEntity {
		return ProjectEntity.create({
			id: doc._id.toString(),
			name: doc.name,
			description: doc.description,
			status: doc.status,
			startDate: doc.startDate,
			endDate: doc.endDate,
			createdBy: doc.createdBy.toString(),
			companyId: doc.companyId.toString(),
			members: doc.members.map((m: any) => m.toString()),
			gitRepoUrl: doc.gitRepoUrl,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}
