import { model } from "mongoose";
import type { IUser } from "../interface/user.interface";
import { userSchema } from "../schema/user.schema";

export const userModel = model<IUser>("Users", userSchema);
