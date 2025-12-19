import { InferSchemaType } from "mongoose";
import { projectSchema } from "../schema/projects.schema";

export type IProject = InferSchemaType<typeof projectSchema>