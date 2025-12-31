import { model } from "mongoose";
import type { IUsersStory } from "../interface/userstory.interface";
import { userStorySchema } from "../schema/user.story.schema";

export const UserStoryModel = model<IUsersStory>("UserStory", userStorySchema);
