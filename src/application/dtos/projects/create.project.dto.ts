import { Exclude, Expose } from "class-transformer";
import {
	IsDateString,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

@Exclude()
export class CreateProjectDTO {
	@Expose()
	@IsString({ message: "Project name must be a string" })
	@MinLength(3, { message: "Project name must be at least 3 characters" })
	@MaxLength(50, { message: "Project name cannot exceed 50 characters" })
	name: string;

	@Expose()
	@IsString({ message: "Description must be a string" })
	@MinLength(10, { message: "Description must be at least 10 characters" })
	@MaxLength(500, { message: "Description cannot exceed 500 characters" })
	description: string;

	@Expose()
	@IsDateString({}, { message: "Start date must be a valid date" })
	startDate: string;

	@Expose()
	@IsDateString({}, { message: "End date must be a valid date" })
	endDate: string;

	@Expose()
	@IsOptional()
	@IsString({ message: "Git repository URL must be a string" })
	gitRepoUrl?: string;

	constructor() {
		this.name = "";
		this.description = "";
		this.startDate = "";
		this.endDate = "";
		this.gitRepoUrl = "";
	}
}
