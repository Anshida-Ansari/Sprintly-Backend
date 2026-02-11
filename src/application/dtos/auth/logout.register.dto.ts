import { Expose } from "class-transformer";
import { IsString } from "class-validator";

@Expose()
export class LogoutDTO {
	@Expose()
	@IsString()
	refreshToken!: string;

	constructor() {
		this.refreshToken = "";
	}
}
