import type { InferSchemaType } from "mongoose";
import type { userSchema } from "../schema/user.schema";

export type IUser = InferSchemaType<typeof userSchema>;
