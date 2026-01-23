import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { IScheduleMeetingUseCase } from "../../../application/usecases/meeting/interface/schedule.meeting.interface";
import type { IGetProjectMeetingsUseCase } from "../../../application/usecases/meeting/interface/get.project.meetings.interface";
import type { IUpdateMeetingStatusUseCase } from "../../../application/usecases/meeting/interface/update.meeting.status.interface";
import { MEETING_TYPES } from "../../../infrastructure/di/types/meeting/meeting.types";
import type { MeetingStatus } from "../../../domain/enum/meeting/meeting.status.enum";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";

@injectable()
export class MeetingController {
	constructor(
		@inject(MEETING_TYPES.ScheduleMeetingUseCase)
		private scheduleMeetingUseCase: IScheduleMeetingUseCase,
		@inject(MEETING_TYPES.GetProjectMeetingsUseCase)
		private getProjectMeetingsUseCase: IGetProjectMeetingsUseCase,
		@inject(MEETING_TYPES.UpdateMeetingStatusUseCase)
		private updateMeetingStatusUseCase: IUpdateMeetingStatusUseCase,
	) {}

	async schedule(req: Request, res: Response, next: NextFunction) {
		try {
			const meeting = await this.scheduleMeetingUseCase.execute(req.body);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Meeting sheduled Successfully",
				data: meeting,
			});
		} catch (error) {
			next(error);
		}
	}

	async getProjectMeetings(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectId } = req.params;

			const meetings = await this.getProjectMeetingsUseCase.execute(projectId);
			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Getting project Successfully",
				data: meetings,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { status } = req.body;
			await this.updateMeetingStatusUseCase.execute(
				id,
				status as MeetingStatus,
			);
			return res.status(SuccessStatus.OK).json({
				success: true,
				message: "Meeting status updated",
			});
		} catch (error) {
			next(error);
		}
	}
}
