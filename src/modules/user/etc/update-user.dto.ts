import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
	@ApiProperty()
	@Length(3)
	@IsString()
	@IsOptional()
	username: string;

	@ApiProperty()
	@IsEmail()
	@IsOptional()
	email: string;
}
