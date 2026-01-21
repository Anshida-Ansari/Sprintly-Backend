import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { MeetingRepository } from "../../../db/repository/implements/meeting.repository";
import type { IMeetingRepository } from "../../../db/repository/interface/meeting.interface";
import { MeetingPersistenceMapper } from "../../../mappers/meeting.persistence.mapper";
import { MEETING_TYPES } from "../../types/meeting/meeting.types";
import { IMeeting } from "@infrastructure/db/interface/meeting.interface";
import { MeetingModel } from "@infrastructure/db/models/meeting.model";

export const MeetingModule = new ContainerModule(({ bind }) => {
    bind<IMeetingRepository>(MEETING_TYPES.IMeetingRepository).to(MeetingRepository);
    bind<MeetingPersistenceMapper>(MEETING_TYPES.MeetingPersistenceMapper).to(MeetingPersistenceMapper).inSingletonScope();
    bind<Model<IMeeting>>(MEETING_TYPES.MeetingModel).toConstantValue(MeetingModel);
});
