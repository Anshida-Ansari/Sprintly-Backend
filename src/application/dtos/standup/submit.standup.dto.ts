import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";

@Exclude()
export class SubmitStandupDTO {
	@Expose()
	@IsString({ message: "Yesterday's update must be a string" })
	@MinLength(5, {
		message: "Please provide more detail about yesterday's work",
	})
	@MaxLength(1000, { message: "Update is too long" })
	yesterday: string;

	@Expose()
	@IsString({ message: "Today's update must be a string" })
	@MinLength(5, { message: "Please provide more detail about today's plan" })
	@MaxLength(1000, { message: "Update is too long" })
	today: string;

	@Expose()
	@IsOptional()
	@IsString({ message: "Blockers must be a string" })
	@MaxLength(500, { message: "Blockers description is too long" })
	blockers?: string;
}
