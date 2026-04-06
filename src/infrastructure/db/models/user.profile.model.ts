import { model } from "mongoose";
import type { IUserProfile } from "../interface/user.profile.model";
import { userProfileSchema } from "../schema/user.profile.schema";

export const UserProfileModel = model<IUserProfile>(
	"UserProfile",
	userProfileSchema,
);
