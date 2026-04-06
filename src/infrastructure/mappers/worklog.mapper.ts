import { WorkLogEntity } from "@domain/entities/worklog.entity";
import { injectable } from "inversify";

@injectable()
export class WorkLogMapper {
	toMongo(entity: WorkLogEntity): any {
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

	fromMongo(doc: any): WorkLogEntity {
		return WorkLogEntity.create({
			id: doc._id.toString(),
			userId: doc.userId.toString(),
			projectId: doc.projectId.toString(),
			sprintId: doc.sprintId.toString(),
			taskId: doc.taskId.toString(),
			subTaskId: doc.subTaskId.toString(),
			hours: doc.hours,
			description: doc.description,
			date: doc.date,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}
