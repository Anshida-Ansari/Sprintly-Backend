import type { ScheduleMeetingDTO } from "../../dtos/meeting/schedule.meeting.dto";
import type { MeetingEntity } from "../../../../domain/entities/meeting.entity";

export interface IScheduleMeetingUseCase {
	execute(data: ScheduleMeetingDTO): Promise<MeetingEntity>;
}
