import { Exclude, Expose } from "class-transformer";
import {
	IsEnum,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";
import { PriorityStatus } from "../../../domain/enum/userstory/user.story.priority";
import { UserStoryStatus } from "../../../domain/enum/userstory/user.story.status";

@Exclude()
export class CreateUserStoryDTO {
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
	@IsEnum(UserStoryStatus, { message: "Invalid status value" })
	status?: UserStoryStatus;
}
