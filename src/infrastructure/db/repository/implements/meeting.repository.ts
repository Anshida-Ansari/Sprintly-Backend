import { inject, injectable } from "inversify";
import { Types, type Model } from "mongoose";
import type { MeetingEntity } from "../../../../domain/entities/meeting.entity";
import { MEETING_TYPES } from "../../../di/types/meeting/meeting.types";
import type { MeetingPersistenceMapper } from "../../../mappers/meeting.persistence.mapper";
import type { IMeetingRepository } from "../interface/meeting.interface";
import { BaseRepository } from "./base.repository";
import { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";

@injectable()
export class MeetingRepository extends BaseRepository<MeetingEntity> implements IMeetingRepository {
    constructor(
        @inject(MEETING_TYPES.MeetingModel)
        model: Model<MeetingEntity>, 
        @inject(MEETING_TYPES.MeetingPersistenceMapper)
        private readonly _meetingMapper: MeetingPersistenceMapper
    ) {
        super(model);
    }

   async create(meeting: MeetingEntity): Promise<MeetingEntity> {
        const raw = this._meetingMapper.toMongo(meeting);
        const created = await this.model.create(raw);
        return this._meetingMapper.fromMongo(created);
    }

    async findByProjectId(projectId: string): Promise<MeetingEntity[]> {
        const docs = await this.model.find({ 
            projectId: new Types.ObjectId(projectId) 
        }).sort({ date: 1 }).exec(); 
        
        return docs.map(doc => this._meetingMapper.fromMongo(doc));
    }

    async updateStatus(id: string, status: MeetingStatus): Promise<void> {
        await this.model.findByIdAndUpdate(id, { status }).exec();
    }

    async findByRoomId(roomId: string): Promise<MeetingEntity | null> {
        const doc = await this.model.findOne({ roomId }).exec();
        return doc ? this._meetingMapper.fromMongo(doc) : null;
    }

}
