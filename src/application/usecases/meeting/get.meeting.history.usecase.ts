import { inject, injectable } from "inversify";
import type { MeetingEntity } from "../../../domain/entities/meeting.entity";
import { MeetingStatus } from "../../../domain/enum/meeting/meeting.status.enum";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import type { IGetMeetingHistoryUseCase } from "./interface/get.meeting.history.interface";

@injectable()
export class GetMeetingHistoryUseCase implements IGetMeetingHistoryUseCase {
	constructor(
		@inject(MEETING_TYPES.IMeetingRepository)
		private readonly meetingRepository: IMeetingRepository,
	) {}

	async execute(projectId: string): Promise<MeetingEntity[]> {
		const meetings = await this.meetingRepository.findByProjectId(projectId);

		return meetings.filter(
			(meeting: MeetingEntity) =>
				meeting.status === MeetingStatus.COMPLETED ||
				meeting.status === MeetingStatus.CANCELLED,
		);
	}
}
