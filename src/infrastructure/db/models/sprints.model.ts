import { model } from "mongoose";
import type { ISprints } from "../interface/sprints.interface";
import { sprintSchema } from "../schema/sprints.schema";

export const SprintModel = model<ISprints>("Sprints", sprintSchema);
