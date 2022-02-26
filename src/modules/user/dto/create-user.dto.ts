import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
	@ApiProperty()
	@Length(3)
	@IsString()
	username: string;

	@ApiProperty()
	@Length(8, 32)
	@IsString()
	password: string;

	@ApiProperty()
	@IsEmail()
	email: string;
}
