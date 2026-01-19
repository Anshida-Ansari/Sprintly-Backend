import { InferSchemaType } from "mongoose";
import { standupSchema } from "../schema/standup.schema";

export type IStandup = InferSchemaType<typeof standupSchema>