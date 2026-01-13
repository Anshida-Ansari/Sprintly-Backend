import { InferSchemaType } from "mongoose";
import { subTaskSchema } from "../schema/subtask.schema";

export type ISubtTask = InferSchemaType<typeof subTaskSchema>