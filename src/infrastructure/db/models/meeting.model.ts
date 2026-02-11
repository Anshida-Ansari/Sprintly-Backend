import { model } from "mongoose";
import type { IMeeting } from "../interface/meeting.interface";
import { meetingSchema } from "../schema/meeting.schema";

export const MeetingModel = model<IMeeting>("Meeting", meetingSchema);
