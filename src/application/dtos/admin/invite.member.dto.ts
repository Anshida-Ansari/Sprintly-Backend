import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsEnum 
} from "class-validator";
import { Exclude, Expose } from "class-transformer";

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