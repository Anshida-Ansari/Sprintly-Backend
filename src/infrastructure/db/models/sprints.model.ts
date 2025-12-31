import { model } from "mongoose";
import type { ISprints } from "../interface/sprints.interface";
import { sprintSchema } from "../schema/sprints.schema";

export const sprintModel = model<ISprints>("Sprints", sprintSchema);
