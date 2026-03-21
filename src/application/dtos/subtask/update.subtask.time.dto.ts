import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsNumber, Min } from "class-validator";

@Exclude()
export class UpdateSubtaskTimeDTO {
	@Expose()
	@IsOptional()
	@IsNumber({}, { message: "Estimated hours must be a number" })
	@Min(0, { message: "Estimated hours cannot be negative" })
	estimatedHours?: number;

	@Expose()
	@IsOptional()
	@IsNumber({}, { message: "Actual hours must be a number" })
	@Min(0, { message: "Actual hours cannot be negative" })
	actualHours?: number;
}
