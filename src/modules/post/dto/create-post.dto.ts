import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDTO {
	@ApiProperty()
	@Length(3)
	@IsString()
	title: string;

	@ApiProperty()
	@Length(5, 28)
	@IsString()
	short_description: string;

	@ApiProperty()
	@Length(10)
	@IsString()
	description: string;
}
