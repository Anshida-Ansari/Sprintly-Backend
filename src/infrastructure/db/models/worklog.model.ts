import { model } from "mongoose";
import type { IWorkLog } from "../interface/worklog.interface";
import { workLogSchema } from "../schema/worklog.schema";

export const WorkLogModel = model<IWorkLog>("WorkLog", workLogSchema);
