import type { MeetingStatus } from "../../../../domain/enum/meeting/meeting.status.enum";

export interface IUpdateMeetingStatusUseCase {
	execute(id: string, status: MeetingStatus): Promise<void>;
}
