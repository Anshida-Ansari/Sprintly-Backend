import { InferSchemaType } from "mongoose";
import { userProfileSchema } from "../schema/user.profile.schema";

export type IUserProfile = InferSchemaType<typeof userProfileSchema>