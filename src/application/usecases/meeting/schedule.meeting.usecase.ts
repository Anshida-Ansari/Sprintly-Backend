import { inject, injectable } from "inversify";
import { MeetingEntity } from "../../../domain/entities/meeting.entity";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";
import { SignalingGateway } from "../../../presentation/socket/signaling.gateway";

import type { IScheduleMeetingUseCase } from "./interface/schedule.meeting.interface";

@injectable()
export class ScheduleMeetingUseCase implements IScheduleMeetingUseCase {
	constructor(
		@inject(MEETING_TYPES.IMeetingRepository)
		private readonly meetingRepository: IMeetingRepository,
	) {}

	async execute(data: {
		projectId: string;
		title: string;
		link?: string;
		date: Date;
		type: "single" | "group";
		createdBy: string;
		participants?: string[];
	}): Promise<MeetingEntity> {
		const meeting = MeetingEntity.create({
			projectId: data.projectId,
			title: data.title,
			date: new Date(data.date),
			createdBy: data.createdBy!,
			link: data.link,
			type: data.type,
			status: MeetingStatus.SCHEDULED,
			participants: data.participants?.map((userId) => ({ userId })),
		});

		const savedMeeting = await this.meetingRepository.create(meeting);

		data.participants?.forEach((userId) => {
			SignalingGateway.sendNotification(userId, "meeting-scheduled", {
				meetingId: savedMeeting.id,
				title: savedMeeting.title,
				date: savedMeeting.date,
				roomId: savedMeeting.roomId,
			});
		});

		return savedMeeting;
	}
}
