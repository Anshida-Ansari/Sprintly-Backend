import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { MeetingRepository } from "../../../db/repository/implements/meeting.repository";
import type { IMeetingRepository } from "../../../db/repository/interface/meeting.interface";
import { MeetingPersistenceMapper } from "../../../mappers/meeting.persistence.mapper";
import { MEETING_TYPES } from "../../types/meeting/meeting.types";
import { IMeeting } from "@infrastructure/db/interface/meeting.interface";
import { MeetingModel } from "@infrastructure/db/models/meeting.model";
import { ScheduleMeetingUseCase } from "../../../../application/usecases/meeting/schedule.meeting.usecase";
import { GetProjectMeetingsUseCase } from "../../../../application/usecases/meeting/get.project.meetings.usecase";
import { UpdateMeetingStatusUseCase } from "../../../../application/usecases/meeting/update.meeting.status.usecase";
import { IScheduleMeetingUseCase } from "../../../../application/usecases/meeting/interface/schedule.meeting.interface";
import { IGetProjectMeetingsUseCase } from "../../../../application/usecases/meeting/interface/get.project.meetings.interface";
import { IUpdateMeetingStatusUseCase } from "../../../../application/usecases/meeting/interface/update.meeting.status.interface";
import { MeetingController } from "../../../../presentation/http/controllers/meeting.controller";

export const MeetingModule = new ContainerModule(({ bind }) => {
    bind<IMeetingRepository>(MEETING_TYPES.IMeetingRepository).to(MeetingRepository);
    bind<MeetingPersistenceMapper>(MEETING_TYPES.MeetingPersistenceMapper).to(MeetingPersistenceMapper).inSingletonScope();
    bind<Model<IMeeting>>(MEETING_TYPES.MeetingModel).toConstantValue(MeetingModel);

    bind<IScheduleMeetingUseCase>(MEETING_TYPES.ScheduleMeetingUseCase).to(ScheduleMeetingUseCase);
    bind<IGetProjectMeetingsUseCase>(MEETING_TYPES.GetProjectMeetingsUseCase).to(GetProjectMeetingsUseCase);
    bind<IUpdateMeetingStatusUseCase>(MEETING_TYPES.UpdateMeetingStatusUseCase).to(UpdateMeetingStatusUseCase);
    bind<MeetingController>(MEETING_TYPES.MeetingController).to(MeetingController);
});
