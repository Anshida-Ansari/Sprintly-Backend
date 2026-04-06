import type { MeetingEntity } from "../../../../domain/entities/meeting.entity";

export interface IGetMeetingHistoryUseCase {
	execute(projectId: string): Promise<MeetingEntity[]>;
}
