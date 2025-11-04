import { model } from "mongoose";
import { userSchema } from "../schema/user.schema";


export const userModel = model('Users',userSchema)