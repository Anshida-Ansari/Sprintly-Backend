import cron from "node-cron";
import type { ICreateNotificationUseCase } from "../../application/usecases/notification/interface/create.notification.interface";
import { MeetingStatus } from "../../domain/enum/meeting/meeting.status.enum";
import { NotificationType } from "../../domain/enum/notification/notification.types";
import type { IMeetingRepository } from "../../infrastructure/db/repository/interface/meeting.interface";
import { container } from "../di/inversify.di";
import { MEETING_TYPES } from "../di/types/meeting/meeting.types";
import { NOTIFICATION_TYPE } from "../di/types/notification/notification";
import { logger } from "../providers/logger/pino.logger";
import type { Model } from "mongoose";
import type { IMeeting } from "../../infrastructure/db/interface/meeting.interface";

interface IMeetingRepositoryWithModel extends IMeetingRepository {
	model: Model<IMeeting>;
}

export class MeetingScheduler {
	private meetingRepository: IMeetingRepository;
	private createNotificationUseCase: ICreateNotificationUseCase;

	constructor() {
		this.meetingRepository = container.get<IMeetingRepository>(
			MEETING_TYPES.IMeetingRepository,
		);
		this.createNotificationUseCase = container.get<ICreateNotificationUseCase>(
			NOTIFICATION_TYPE.ICreateNotificationUseCase,
		);
	}

	public start() {
		cron.schedule("* * * * *", async () => {
			try {
				await this.checkReminders();
			} catch (error) {
				logger.error(
					{ err: error },
					"Error in MeetingScheduler cron job:",
					error,
				);
			}
		});
		logger.info("MeetingScheduler started");
	}

	private async checkReminders() {
		const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
		const rangeStart = new Date(tenMinutesFromNow.getTime() - 30 * 1000);
		const rangeEnd = new Date(tenMinutesFromNow.getTime() + 30 * 1000);

		const meetings = await (
			this.meetingRepository as unknown as IMeetingRepositoryWithModel
		).model
			.find({
				status: MeetingStatus.SCHEDULED,
				date: { $gte: rangeStart, $lte: rangeEnd },
			})
			.exec();

		for (const meeting of meetings) {
			if (meeting.participants && meeting.participants.length > 0) {
				for (const p of meeting.participants) {
					const userId = p.userId?.toString();
					if (!userId) continue;

					const meetingId = meeting._id?.toString() || "";
					const createdBy = meeting.createdBy?.toString() || "";

					await this.createNotificationUseCase.execute(
						userId,
						NotificationType.MEETING_REMINDER,
						`Reminder: Meeting "${meeting.title || "Untitled"}" starts in 10 minutes.`,
						meetingId,
						"MEETING",
						createdBy,
					);
				}
			}
		}
	}
}
