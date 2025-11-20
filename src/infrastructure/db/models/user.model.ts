import { model } from "mongoose";
import { userSchema } from "../schema/user.schema";
import { IUser } from "../interface/user.interface";


export const userModel = model<IUser>('Users',userSchema)