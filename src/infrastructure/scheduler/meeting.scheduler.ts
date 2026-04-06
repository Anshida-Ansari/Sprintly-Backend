import cron from "node-cron";
import { container } from "../di/inversify.di";
import { MEETING_TYPES } from "../di/types/meeting/meeting.types";
import type { IMeetingRepository } from "../../infrastructure/db/repository/interface/meeting.interface";
import { MeetingStatus } from "../../domain/enum/meeting/meeting.status.enum";
import { NOTIFICATION_TYPE } from "../di/types/notification/notification";
import type { ICreateNotificationUseCase } from "../../application/usecases/notification/interface/create.notification.interface";
import { NotificationType } from "../../domain/enum/notification/notification.types";
import { logger } from "../providers/logger/pino.logger";

export class MeetingScheduler {
	private meetingRepository: IMeetingRepository;
	private createNotificationUseCase: ICreateNotificationUseCase;

	constructor() {
		this.meetingRepository = container.get<IMeetingRepository>(MEETING_TYPES.IMeetingRepository);
		this.createNotificationUseCase = container.get<ICreateNotificationUseCase>(NOTIFICATION_TYPE.ICreateNotificationUseCase);
	}

	public start() {
		cron.schedule("* * * * *", async () => {
			try {
				await this.checkReminders();
			} catch (error) {
				logger.error({err:error},"Error in MeetingScheduler cron job:", error);
			}
		});
		logger.info("MeetingScheduler started");
	}

	private async checkReminders() {
		const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
		const rangeStart = new Date(tenMinutesFromNow.getTime() - 30 * 1000); 
		const rangeEnd = new Date(tenMinutesFromNow.getTime() + 30 * 1000);

		const meetings = await (this.meetingRepository as any).model.find({
			status: MeetingStatus.SCHEDULED,
			date: { $gte: rangeStart, $lte: rangeEnd }
		}).exec();

		for (const meeting of meetings) {
			if (meeting.participants && meeting.participants.length > 0) {
				for (const p of meeting.participants) {
					await this.createNotificationUseCase.execute(
						p.userId.toString(),
						NotificationType.MEETING_REMINDER,
						`Reminder: Meeting "${meeting.title}" starts in 10 minutes.`,
						meeting._id.toString(),
						"MEETING",
						meeting.createdBy.toString()
					);
				}
			}
		}
	}
}
