import type { MeetingEntity } from "../../../../domain/entities/meeting.entity";

export interface IGetProjectMeetingsUseCase {
	execute(projectId: string): Promise<MeetingEntity[]>;
}
