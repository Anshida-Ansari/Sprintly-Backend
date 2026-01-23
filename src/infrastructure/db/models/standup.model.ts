import { model } from "mongoose";
import { standupSchema } from "../schema/standup.schema";
import type { IStandup } from "../interface/standup.interface";

export const StandupModel = model<IStandup>("standup", standupSchema);
