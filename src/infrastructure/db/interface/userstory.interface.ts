import type { InferSchemaType } from "mongoose";
import type { userStorySchema } from "../schema/user.story.schema";

export type IUsersStory = InferSchemaType<typeof userStorySchema>;
