import { SprintEntity } from "../../domain/entities/sptint.entities";
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

    fromMongo(doc: any): SprintEntity {
        return SprintEntity.create({
            id: doc._id.toString(),
            projectId: doc.projectId.toString(),
            companyId: doc.companyId.toString(),
            name: doc.name,
            goal: doc.goal,
            startDate: new Date(doc.startDate),
            endDate: new Date(doc.endDate),
            status: doc.status as SprintStatus,
        });
    }
}
