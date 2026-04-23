import type { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";
import { inject, injectable } from "inversify";
import { type Model, Types } from "mongoose";
import type { MeetingEntity } from "../../../../domain/entities/meeting.entity.js";
import { MEETING_TYPES } from "../../../di/types/meeting/meeting.types.js";
import type { MeetingPersistenceMapper } from "../../../mappers/meeting.persistence.mapper.js";
import type { IMeetingRepository } from "../interface/meeting.interface.js";
import { BaseRepository } from "./base.repository.js";

@injectable()
export class MeetingRepository
	extends BaseRepository<MeetingEntity>
	implements IMeetingRepository
{
	constructor(
		@inject(MEETING_TYPES.MeetingModel)
		model: Model<MeetingEntity>,
		@inject(MEETING_TYPES.MeetingPersistenceMapper)
		private readonly _meetingMapper: MeetingPersistenceMapper,
	) {
		super(model);
	}

	async create(meeting: MeetingEntity): Promise<MeetingEntity> {
		const raw = this._meetingMapper.toMongo(meeting);
		const created = await this.model.create(raw);
		return this._meetingMapper.fromMongo(created);
	}

	async findByProjectId(projectId: string): Promise<MeetingEntity[]> {
		const docs = await this.model
			.find({
				projectId: new Types.ObjectId(projectId),
			})
			.sort({ date: 1 })
			.exec();

		return docs.map((doc) => this._meetingMapper.fromMongo(doc));
	}

	async updateStatus(idOrRoomId: string, status: MeetingStatus): Promise<void> {
		const update: Record<string, unknown> = { status };

		let meeting = await this.model.findOne({ roomId: idOrRoomId }).exec();
		if (!meeting) {
			meeting = await this.model.findById(idOrRoomId).exec();
		}

		if (!meeting) return;

		if (status === "COMPLETED") {
			const endTime = new Date();
			update.endTime = endTime;
			const startTime = new Date((meeting as unknown as { date: Date }).date);
			update.duration = Math.floor(
				(endTime.getTime() - startTime.getTime()) / 1000 / 60,
			);
		} else if (status === "CANCELLED") {
			update.cancelledAt = new Date();
		}

		await this.model
			.findByIdAndUpdate((meeting as unknown as { id: string }).id, update)
			.exec();
	}

	async findByRoomId(roomId: string): Promise<MeetingEntity | null> {
		const doc = await this.model.findOne({ roomId }).exec();
		return doc ? this._meetingMapper.fromMongo(doc) : null;
	}
}
