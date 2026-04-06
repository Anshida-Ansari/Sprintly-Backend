import { SubTaskEntity } from "@domain/entities/subtask.entity";

export class SubTaskPersisitanceMapper {
	toMongo(subTask: SubTaskEntity) {
		return {
			_id: subTask.id,
			userStoryId: subTask.userStoryId,
			companyId: subTask.companyId,
			title: subTask.title,
			status: subTask.status,
			assignedTo: subTask.assignedTo,
			estimatedHours: subTask.estimatedHours,
			actualHours: subTask.actualHours,
			comments: subTask.comments,
			attachments: subTask.attachments,
			createdAt: subTask.createdAt,
			updatedAt: subTask.updatedAt,
		};
	}

	fromMongo(doc: any): SubTaskEntity {
		return SubTaskEntity.create({
			id: doc._id.toString(),
			userStoryId: doc.userStoryId.toString(),
			companyId: doc.companyId.toString(),
			title: doc.title,
			status: doc.status,
			assignedTo: doc.assignedTo?.toString(),
			estimatedHours: doc.estimatedHours,
			actualHours: doc.actualHours,
			comments: doc.comments || [],
			attachments: doc.attachments,
		});
	}
}
