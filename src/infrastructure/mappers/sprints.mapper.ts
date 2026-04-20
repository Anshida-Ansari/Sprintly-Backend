import { SprintEntity } from "../../domain/entities/sprint.entity";
import type { SprintStatus } from "../../domain/enum/sprints/sprints.status";

export class SprintPersistenceMapper {
	toMongo(sprint: SprintEntity) {
		return {
			_id: sprint.id,
			projectId: sprint.projectId,
			companyId: sprint.companyId,
			name: sprint.name,
			goal: sprint.goal,
			startDate: sprint.startDate,
			endDate: sprint.endDate,
			status: sprint.status,
			createdAt: sprint.createdAt,
			updatedAt: sprint.updatedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): SprintEntity {
		return SprintEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			projectId: (doc.projectId as { toString(): string }).toString(),
			companyId: (doc.companyId as { toString(): string }).toString(),
			name: doc.name as string,
			goal: doc.goal as string,
			startDate: new Date(doc.startDate as string),
			endDate: new Date(doc.endDate as string),
			status: doc.status as SprintStatus,
		});
	}
}
