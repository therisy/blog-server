import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PatchPostDTO {
	@ApiProperty()
	@IsOptional()
	@Length(3)
	@IsString()
	title: string;

	@ApiProperty()
	@IsOptional()
	@Length(5, 28)
	@IsString()
	short_description: string;

	@ApiProperty()
	@IsOptional()
	@Length(10)
	@IsString()
	description: string;
}
