import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength
} from "class-validator";
import { Exclude, Expose } from "class-transformer";
import { PriorityStatus } from "src/domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "src/domain/enum/userstory/user.story.status";

@Exclude()
export class CreateUserStoryDTO {

  @Expose()
  @IsString({ message: "Project ID must be a string" })
  projectId: string;

  @Expose()
  @IsString({ message: "Title must be a string" })
  @MinLength(3, { message: "Title must be at least 3 characters" })
  @MaxLength(100, { message: "Title cannot exceed 100 characters" })
  title: string;

  @Expose()
  @IsString({ message: "Description must be a string" })
  @MinLength(5, { message: "Description must be at least 5 characters" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description: string;

  @Expose()
  @IsEnum(PriorityStatus, { message: "Invalid priority value" })
  priority: PriorityStatus;

  @Expose()
  @IsOptional()
  @IsString({ message: "Sprint ID must be a string" })
  sprintId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(UserStoryStatus, { message: "Invalid status value" })
  status?: UserStoryStatus;
}
