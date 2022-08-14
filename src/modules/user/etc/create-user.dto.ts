import {
	IsEmail,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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
