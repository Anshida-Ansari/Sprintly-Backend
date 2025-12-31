import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

@Exclude()
export class VerifyOtpDTO {
	@Expose()
	@IsString({ message: "Token is required" })
	token: string;

	@Expose()
	@IsString({ message: "OTP must be a string" })
	@MinLength(4, { message: "OTP must be at least 4 characters long" })
	@MaxLength(6, { message: "OTP cannot be longer than 6 characters" })
	otp: string;

	constructor() {
		this.token = "";
		this.otp = "";
	}
}
