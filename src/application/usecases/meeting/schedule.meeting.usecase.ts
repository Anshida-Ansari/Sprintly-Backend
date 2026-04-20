import type { ScheduleMeetingDTO } from "@application/dtos/meeting/schedule.meeting.dto.js";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { MeetingStatus } from "@domain/enum/meeting/meeting.status.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { BadRequestError } from "@shared/utils/error-handling/errors/bad.request.error";
import { inject, injectable } from "inversify";
import { MeetingEntity } from "../../../domain/entities/meeting.entity";
import type { IMeetingRepository } from "../../../infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import type { IScheduleMeetingUseCase } from "./interface/schedule.meeting.interface";

@injectable()
export class ScheduleMeetingUseCase implements IScheduleMeetingUseCase {
	constructor(
		@inject(MEETING_TYPES.IMeetingRepository)
		private readonly meetingRepository: IMeetingRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(data: ScheduleMeetingDTO): Promise<MeetingEntity> {
		if (new Date(data.date) < new Date()) {
			throw new BadRequestError("Meeting date must be in the future");
		}

		const meeting = MeetingEntity.create({
			projectId: data.projectId,
			title: data.title,
			date: new Date(data.date),
			createdBy: data.createdBy,
			link: data.link,
			type: data.type,
			status: MeetingStatus.SCHEDULED,
			duration: data.duration,
			participants: data.participants?.map((userId: any) => ({ userId })),
		});

		const savedMeeting = await this.meetingRepository.create(meeting);

		if (data.participants && data.participants.length > 0) {
			for (const userId of data.participants) {
				if (!savedMeeting.id) {
					console.error("Meeting ID missing after save");
					continue;
				}

				await this._createNotificationUseCase.execute(
					userId,
					NotificationType.MEETING_SCHEDULED,
					`New meeting scheduled: ${savedMeeting.title}`,
					savedMeeting.id,
					"MEETING",
					data.createdBy,
				);
			}
		}

		return savedMeeting;
	}
}
