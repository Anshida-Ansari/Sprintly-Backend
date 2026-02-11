import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength, MaxLength } from "class-validator";

@Exclude()
export class AddStandupCommentDTO {
	@Expose()
	@IsString({ message: "Comment text must be a string" })
	@MinLength(1, { message: "Comment cannot be empty" })
	@MaxLength(500, { message: "Comment cannot exceed 500 characters" })
	text: string;
}
