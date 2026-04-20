import type { PriorityStatus } from "@domain/enum/userstory/user.story.priority";
import type { UserStoryStatus } from "@domain/enum/userstory/user.story.status";
import { UserStoryEntity } from "../../domain/entities/user.story.entities";

export class UserStoryPersisitanceMapper {
	toMongo(userStory: UserStoryEntity) {
		return {
			_id: userStory.id,
			projectId: userStory.projectId,
			companyId: userStory.companyId,
			title: userStory.title,
			description: userStory.description,
			status: userStory.status,
			priority: userStory.priority,
			sprintId: userStory.sprintId,
			assignedTo: userStory.assignedTo,
			comments: userStory.comments,
			estimationPoints: userStory.estimationPoints,
			acceptanceCriteria: userStory.acceptanceCriteria,
			adminId: userStory.adminId,
			createdAt: userStory.createdAt,
			updatedAt: userStory.updatedAt,
			completedAt: userStory.completedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): UserStoryEntity {
		const allowedPoints = [1, 2, 3, 5, 8, 13];
		let parsedEstimationPoints = doc.estimationPoints as number;

		if (
			parsedEstimationPoints !== undefined &&
			parsedEstimationPoints !== null &&
			!allowedPoints.includes(parsedEstimationPoints)
		) {
			parsedEstimationPoints = allowedPoints.reduce((prev, curr) =>
				Math.abs(curr - parsedEstimationPoints) <
				Math.abs(prev - parsedEstimationPoints)
					? curr
					: prev,
			);
		}

		return UserStoryEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			projectId: (doc.projectId as { toString(): string }).toString(),
			companyId: (doc.companyId as { toString(): string }).toString(),
			title: doc.title as string,
			description: doc.description as string,
			priority: doc.priority as PriorityStatus,
			sprintId: (doc.sprintId as { toString(): string | undefined })?.toString(),
			assignedTo: doc.assignedTo
				? (doc.assignedTo as unknown[]).map((id) =>
						(id as { toString(): string }).toString(),
					)
				: [],
			comments: (doc.comments as Array<{
				createdAt: Date;
				message: string;
				userName?: string;
				userId: string;
			}>) || [],
			status: doc.status as UserStoryStatus,
			estimationPoints: parsedEstimationPoints,
			acceptanceCriteria: (doc.acceptanceCriteria as string[]) || [],
			adminId: (doc.adminId as { toString(): string | undefined })?.toString(),
			completedAt: doc.completedAt as Date,
		});
	}
}
