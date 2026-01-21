import { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";
import type { MeetingEntity } from "../../../../domain/entities/meeting.entity";
import type { IBaseRepository } from "./base.repository";

export interface IMeetingRepository extends IBaseRepository<MeetingEntity> {
    create(meeting: MeetingEntity): Promise<MeetingEntity>;
    findByProjectId(projectId: string): Promise<MeetingEntity[]>;
    updateStatus(id: string, status: MeetingStatus): Promise<void>;
    findByRoomId(roomId: string):Promise<MeetingEntity | null>
}
