import { inject, injectable } from "inversify";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import { MeetingStatus } from "../../../domain/enum/meeting/meeting.status.enum";

@injectable()
export class UpdateMeetingStatusUseCase {
    constructor(
        @inject(MEETING_TYPES.IMeetingRepository)
        private readonly meetingRepository: IMeetingRepository
    ) { }

    async execute(meetingId: string, status: MeetingStatus): Promise<void> {
        await this.meetingRepository.updateStatus(meetingId, status);

        // // TODO: Trigger socket notification here
        // if (status === MeetingStatus.ONGOING) {
        //     // notifyProjectMembers(meetingId, "Meeting is live!");
        // }
    }
}
