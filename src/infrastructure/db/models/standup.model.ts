import { model } from "mongoose";
import type { IStandup } from "../interface/standup.interface";
import { standupSchema } from "../schema/standup.schema";

export const StandupModel = model<IStandup>("standup", standupSchema);
