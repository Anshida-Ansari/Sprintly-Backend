import { MeetingEntity } from "@domain/entities/meeting.entity";
import { Types } from "mongoose";

export class MeetingPersistenceMapper {
	fromMongo(doc: any): MeetingEntity {
		return MeetingEntity.create({
			id: doc._id.toString(),
			projectId: doc.projectId.toString(),
			title: doc.title,
			link: doc.link,
			roomId: doc.roomId,
			date: doc.date,
			type: doc.type,
			createdBy: doc.createdBy.toString(),
			status: doc.status,
			participants: doc.participants?.map((p: any) => ({
				userId: p.userId.toString(),
				joinedAt: p.joinedAt,
			})),
			endTime: doc.endTime,
			duration: doc.duration,
			cancelledAt: doc.cancelledAt,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
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
