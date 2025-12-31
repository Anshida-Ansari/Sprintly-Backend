import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ResendAdminOtpDTO {
	@Expose()
	@IsString({ message: "Token is required" })
	token: string;

	constructor() {
		this.token = "";
	}
}
