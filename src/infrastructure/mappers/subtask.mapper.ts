import { SubTaskEntity } from "@domain/entities/subtask.entity";
import type { SubTaskStatus } from "@domain/enum/subtask/subtask.status";

export class SubTaskPersisitanceMapper {
	toMongo(subTask: SubTaskEntity) {
		return {
			_id: subTask.id,
			userStoryId: subTask.userStoryId,
			companyId: subTask.companyId,
			title: subTask.title,
			status: subTask.status,
			// assignedTo: subTask.assignedTo,
			estimatedHours: subTask.estimatedHours,
			actualHours: subTask.actualHours,
			comments: subTask.comments,
			attachments: subTask.attachments,
			createdAt: subTask.createdAt,
			updatedAt: subTask.updatedAt,
			completedAt: subTask.completedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): SubTaskEntity {
		return SubTaskEntity.create({
			id: (doc._id as string)?.toString() || "",
			userStoryId: (doc.userStoryId as string)?.toString() || "",
			companyId: (doc.companyId as string)?.toString() || "",
			title: doc.title as string,
			status: doc.status as SubTaskStatus,
			// assignedTo: (doc.assignedTo as string)?.toString() || "",
			estimatedHours: doc.estimatedHours as number,
			actualHours: doc.actualHours as number,
			comments:
				(doc.comments as Array<{
					userId: string;
					userName?: string;
					message: string;
					createdAt: Date;
				}>) || [],
			attachments:
				(doc.attachments as Array<{
					fileUrl: string;
					fileName: string;
					uploadedBy: string;
					createdAt: Date;
				}>) || [],
			completedAt: doc.completedAt as Date,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	}
}
