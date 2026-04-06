import type { InferSchemaType } from "mongoose";
import type { userProfileSchema } from "../schema/user.profile.schema";

export type IUserProfile = InferSchemaType<typeof userProfileSchema>;
