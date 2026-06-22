import { WorkLogEntity } from "@domain/entities/worklog.entity";
import { injectable } from "inversify";

@injectable()
export class WorkLogMapper {
	toMongo(entity: WorkLogEntity): Record<string, unknown> {
		return {
			userId: entity.userId,
			projectId: entity.projectId,
			sprintId: entity.sprintId,
			taskId: entity.taskId,
			subTaskId: entity.subTaskId,
			hours: entity.hours,
			description: entity.description,
			date: entity.date,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: MongoDB document type
	fromMongo(doc: any): WorkLogEntity {
		return WorkLogEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			userId: (doc.userId as { toString(): string }).toString(),
			projectId: (doc.projectId as { toString(): string }).toString(),
			sprintId: (doc.sprintId as { toString(): string }).toString(),
			taskId: (doc.taskId as { toString(): string }).toString(),
			subTaskId: (doc.subTaskId as { toString(): string }).toString(),
			hours: doc.hours as number,
			description: doc.description as string,
			date: doc.date as Date,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	}
}
