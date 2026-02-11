import type { InferSchemaType } from "mongoose";
import type { meetingSchema } from "../schema/meeting.schema";

export type IMeeting = InferSchemaType<typeof meetingSchema>;
