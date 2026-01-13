import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

@Exclude()
export class CreateSubTaskDTO {
    @Expose()
    @IsString({ message: "Title must be a string" })
    @MinLength(3, { message: "Title must be at least 3 characters" })
    @MaxLength(150, { message: "Title cannot exceed 150 characters" })
    title: string;

    @Expose()
    @IsOptional()
    @IsString({ message: "Assigned member ID must be a string" })
    assignedTo?: string;
}