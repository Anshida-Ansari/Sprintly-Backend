import { model } from "mongoose";
import { ISprints } from "../interface/sprints.interface";
import { sprintSchema } from "../schema/sprints.schema";

export const sprintModel = model<ISprints>('Sprints',sprintSchema)