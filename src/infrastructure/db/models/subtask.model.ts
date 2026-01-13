import { model } from "mongoose";
import { ISubtTask } from "../interface/subtask.interface";
import { subTaskSchema } from "../schema/subtask.schema";

export const SubTaskModel = model<ISubtTask>("SubTask",subTaskSchema)