import { InferSchemaType } from "mongoose";
import { userStorySchema } from "../schema/user.story.schema";

export type IUsersStory = InferSchemaType<typeof userStorySchema>