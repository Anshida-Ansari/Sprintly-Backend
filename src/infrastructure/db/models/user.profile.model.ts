import { model } from "mongoose";
import { IUserProfieModel } from "../interface/user.model.profile";
import { userProfileSchema } from "../schema/user.profile.schema";

export const userProfileModel = model<IUserProfieModel>("UserProfile", userProfileSchema)