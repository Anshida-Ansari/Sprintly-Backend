import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ResendAdminOtpDTO {
	@Expose()
	@IsString({ message: "Token must be a string" })
	@IsOptional()
	token?: string;

	@Expose()
	@IsString({ message: "Email must be a string" })
	@IsOptional()
	email?: string;

	constructor() {
		this.token = "";
		this.email = "";
	}
}
