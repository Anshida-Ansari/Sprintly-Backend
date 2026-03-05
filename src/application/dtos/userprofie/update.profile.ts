import { Exclude, Expose, Type } from "class-transformer";
import {
	IsArray,
	IsOptional,
	IsString,
	MaxLength,
	ArrayMaxSize
} from "class-validator";

@Exclude()
export class UpdateUserProfileDTO {

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(15)
	phoneNumber?: string;

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(200)
	address?: string;

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(500)
	bio?: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(20)
	@IsString({ each: true })
	skills?: string[];

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(300)
	avatarUrl?: string;

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(300)
	linkedin?: string;

	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(300)
	github?: string;
}