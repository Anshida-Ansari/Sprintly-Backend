import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class InviteMemberDTO {
	@Expose()

	@Expose()
	@IsString({ message: "Name must be a string" })
	@IsNotEmpty({ message: "Name is required" })
	name!: string;

	@Expose()
	@IsEmail({}, { message: "Invalid email format" })
	@IsNotEmpty({ message: "Email is required" })
	email!: string;
}
