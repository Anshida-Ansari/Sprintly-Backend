import { inject, injectable } from "inversify";
import type { MeetingEntity } from "../../../domain/entities/meeting.entity";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";

@injectable()
export class GetProjectMeetingsUseCase {
    constructor(
        @inject(MEETING_TYPES.IMeetingRepository)
        private readonly meetingRepository: IMeetingRepository
    ) { }

    async execute(projectId: string): Promise<MeetingEntity[]> {
        return await this.meetingRepository.findByProjectId(projectId);
    }
}
