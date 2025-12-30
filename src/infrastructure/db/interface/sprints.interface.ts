import { InferSchemaType } from "mongoose";
import { sprintSchema } from "../schema/sprints.schema";

export type ISprints = InferSchemaType<typeof sprintSchema>