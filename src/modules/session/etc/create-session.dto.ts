import {
	IsEmail,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionDto {
	@ApiProperty()
	@IsEmail()
	email: string;

    @ApiProperty()
	@Length(8, 32)
	@IsString()
	password: string;
}
