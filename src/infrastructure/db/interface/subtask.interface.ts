import type { InferSchemaType } from "mongoose";
import type { subTaskSchema } from "../schema/subtask.schema";

export type ISubtTask = InferSchemaType<typeof subTaskSchema>;
