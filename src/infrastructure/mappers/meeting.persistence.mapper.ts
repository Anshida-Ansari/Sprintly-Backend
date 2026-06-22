import { MeetingEntity } from "@domain/entities/meeting.entity";
import type { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";
import { Types } from "mongoose";

export class MeetingPersistenceMapper {
	fromMongo(doc: any): MeetingEntity {
		return MeetingEntity.create({
			id: (doc._id as { toString(): string }).toString(),
			projectId: (doc.projectId as { toString(): string }).toString(),
			title: doc.title as string,
			link: doc.link as string,
			roomId: doc.roomId as string,
			date: doc.date as Date,
			type: doc.type as "single" | "group",
			createdBy: (doc.createdBy as { toString(): string }).toString(),
			status: doc.status as MeetingStatus,
			participants: (doc.participants as Array<Record<string, unknown>>)?.map(
				(p) => ({
					userId: (p.userId as { toString(): string }).toString(),
					joinedAt: p.joinedAt as Date,
				}),
			),
			endTime: doc.endTime as Date,
			duration: doc.duration as number,
			cancelledAt: doc.cancelledAt as Date,
			createdAt: doc.createdAt as Date,
			updatedAt: doc.updatedAt as Date,
		});
	}

	toMongo(entity: MeetingEntity) {
		return {
			projectId: new Types.ObjectId(entity.projectId),
			title: entity.title,
			link: entity.link,
			roomId: entity.roomId,
			date: entity.date,
			type: entity.type,
			createdBy: new Types.ObjectId(entity.createdBy),
			status: entity.status,
			participants: entity.participants.map((p) => ({
				userId: new Types.ObjectId(p.userId),
				joinedAt: p.joinedAt,
			})),
			endTime: entity.endTime,
			duration: entity.duration,
			cancelledAt: entity.cancelledAt,
		};
	}
}
