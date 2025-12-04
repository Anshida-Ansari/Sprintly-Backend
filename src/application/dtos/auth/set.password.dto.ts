import { Exclude, Expose } from "class-transformer";
import { IsString, Matches, MaxLength, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@Exclude()
export class SetPasswordDTO {

    
    @Expose()
    @IsString({ message: "Token is required" })

    @Expose()
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @MaxLength(20, { message: "Password cannot exceed 20 characters" })
    @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain 1 uppercase letter and 1 number",
    })
    password!: string;

    @IsString()
    @MinLength(6)
    confirmPassword!: string;


}