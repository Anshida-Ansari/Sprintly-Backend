import { inject, injectable } from "inversify";
import { MeetingEntity } from "../../../domain/entities/meeting.entity";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";

@injectable()
export class ScheduleMeetingUseCase {
    constructor(
        @inject(MEETING_TYPES.IMeetingRepository)
        private readonly meetingRepository: IMeetingRepository
    ) { }

    async execute(data: {
        projectId: string;
        title: string;
        link?: string;
        date: Date;
        type: "single" | "group";
        createdBy: string;
        participants?: string[];
    }): Promise<MeetingEntity> {
        const meeting = MeetingEntity.create({
             projectId: data.projectId,
                title: data.title,
                date: new Date(data.date),
                createdBy: data.createdBy!,
                link: data.link,
                type: data.type,
                status: MeetingStatus.SCHEDULED
        });

        
        return await this.meetingRepository.create(meeting);
    }
}
