import type { InferSchemaType } from "mongoose";
import type { projectSchema } from "../schema/projects.schema";

export type IProject = InferSchemaType<typeof projectSchema>;
