
import { MeetingEntity } from "../../../../domain/entities/meeting.entity";

export interface IScheduleMeetingUseCase {
    execute(data: any): Promise<MeetingEntity>;
}
