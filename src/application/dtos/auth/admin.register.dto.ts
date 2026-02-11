import { Exclude, Expose } from "class-transformer";
import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	Validate,
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "passwordMatch", async: false })
class PasswordMatchConstraint implements ValidatorConstraintInterface {
	validate(confirmPassword: string, args: ValidationArguments) {
		const dto = args.object as AdminRegisterDTO;
		return dto.password === confirmPassword;
	}

	defaultMessage() {
		return "Confirm password must match the password";
	}
}

@Exclude()
export class AdminRegisterDTO {
	@Expose()
	@IsString({ message: "Lead name must be a string" })
	@MinLength(3, { message: "Lead name must be at least 3 characters" })
	@MaxLength(20, { message: "Lead name cannot be more than 20 characters" })
	name!: string;

	@Expose()
	@IsString({ message: "Company name must be a string" })
	@MinLength(2, { message: "Company name must be at least 2 characters" })
	@MaxLength(40, { message: "Company name cannot be more than 40 characters" })
	companyName!: string;

	@Expose()
	@IsEmail({}, { message: "Invalid email format" })
	email!: string;

	@Expose()
	@IsString()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@MaxLength(20, { message: "Password cannot exceed 20 characters" })
	@Matches(/^(?=.*[A-Z])(?=.*\d)/, {
		message: "Password must contain 1 uppercase letter and 1 number",
	})
	password!: string;

	@Expose()
	@IsString()
	@MinLength(8)
	@Validate(PasswordMatchConstraint)
	confirmPassword!: string;
}
