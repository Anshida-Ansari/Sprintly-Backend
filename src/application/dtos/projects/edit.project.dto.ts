import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsEnum
} from "class-validator";
import { Exclude, Expose } from "class-transformer";
import { ProjectStatus } from "../../../domain/enum/project/project.status";

@Exclude()
export class EditProjectDTO {

  @Expose()
  @IsOptional()
  @IsString({ message: "Project name must be a string" })
  @MinLength(3, { message: "Project name must be at least 3 characters" })
  @MaxLength(50, { message: "Project name cannot exceed 50 characters" })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description?: string;

  @Expose()
  @IsOptional()
  @IsDateString({}, { message: "Start date must be a valid date" })
  startDate?: string;

  @Expose()
  @IsOptional()
  @IsDateString({}, { message: "End date must be a valid date" })
  endDate?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Git repository URL must be a string" })
  gitRepoUrl?: string;

  @Expose()
  @IsOptional()
  @IsEnum(ProjectStatus, { message: "Invalid project status" })
  status?: ProjectStatus;
}
