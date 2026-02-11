import type { InferSchemaType } from "mongoose";
import type { sprintSchema } from "../schema/sprints.schema";

export type ISprints = InferSchemaType<typeof sprintSchema>;
