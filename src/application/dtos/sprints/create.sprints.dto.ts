import { Exclude, Expose, Type } from "class-transformer";
import {
	IsDate,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

@Exclude()
export class CreateSprintDTO {
	@Expose()
	@IsString({ message: "Sprint name must be a string" })
	@MinLength(3, { message: "Sprint name must be at least 3 characters" })
	@MaxLength(100, { message: "Sprint name cannot exceed 100 characters" })
	name: string;

	@Expose()
	@IsOptional()
	@IsString({ message: "Goal must be a string" })
	@MaxLength(300, { message: "Goal cannot exceed 300 characters" })
	goal?: string;

	@Expose()
	@Type(() => Date)
	@IsDate({ message: "Start date must be a valid date" })
	startDate: Date;

	@Expose()
	@Type(() => Date)
	@IsDate({ message: "End date must be a valid date" })
	endDate: Date;
}
