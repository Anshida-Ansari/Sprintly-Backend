import type { InferSchemaType } from "mongoose";
import type { standupSchema } from "../schema/standup.schema";

export type IStandup = InferSchemaType<typeof standupSchema>;
