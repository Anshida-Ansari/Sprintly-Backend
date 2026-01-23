import { inject, injectable } from "inversify";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import type { MeetingStatus } from "../../../domain/enum/meeting/meeting.status.enum";

import type { IUpdateMeetingStatusUseCase } from "./interface/update.meeting.status.interface";

@injectable()
export class UpdateMeetingStatusUseCase implements IUpdateMeetingStatusUseCase {
	constructor(
		@inject(MEETING_TYPES.IMeetingRepository)
		private readonly meetingRepository: IMeetingRepository,
	) {}

	async execute(meetingId: string, status: MeetingStatus): Promise<void> {
		await this.meetingRepository.updateStatus(meetingId, status);
	}
}
