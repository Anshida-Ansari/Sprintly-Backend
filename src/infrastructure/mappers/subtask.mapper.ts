import { SubTaskEntity } from "@domain/entities/subtask.entity";

export class SubTaskPersisitanceMapper {
    toMongo(subTask: SubTaskEntity) {
        return {
            _id: subTask.id,
            userStoryId: subTask.userStoryId,
            companyId: subTask.companyId,
            title: subTask.title,
            isDone: subTask.isDone,
            assignedTo: subTask.assignedTo,
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
            isDone: doc.isDone, // Added this
            assignedTo: doc.assignedTo?.toString(),
        });
    }
}