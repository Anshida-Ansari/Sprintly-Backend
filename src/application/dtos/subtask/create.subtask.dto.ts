import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength, IsNumber, Min } from "class-validator";

@Exclude()
export class CreateSubTaskDTO {
	@Expose()
	@IsString({ message: "Title must be a string" })
	@MinLength(3, { message: "Title must be at least 3 characters" })
	@MaxLength(150, { message: "Title cannot exceed 150 characters" })
	title: string;

	@Expose()
	@IsOptional()
	@IsNumber({}, { message: "Estimated hours must be a number" })
	@Min(0, { message: "Estimated hours cannot be negative" })
	estimatedHours?: number;
}
