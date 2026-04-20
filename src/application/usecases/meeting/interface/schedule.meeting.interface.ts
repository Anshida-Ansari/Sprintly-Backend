import type { ScheduleMeetingDTO } from "@application/dtos/meeting/schedule.meeting.dto.js";
import type { MeetingEntity } from "../../../../domain/entities/meeting.entity.js";

export interface IScheduleMeetingUseCase {
	execute(data: ScheduleMeetingDTO): Promise<MeetingEntity>;
}
