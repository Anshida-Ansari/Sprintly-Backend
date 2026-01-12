import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class AssignUserStoryToSprintDTO {
  @Expose()
  @IsString({ message: "User story ID must be a string" })
  userStoryId: string;

  @Expose()
  @IsString({ message: "Sprint ID must be a string" })
  sprintId: string;

  constructor() {
    this.userStoryId = "";
    this.sprintId = "";
  }
}
