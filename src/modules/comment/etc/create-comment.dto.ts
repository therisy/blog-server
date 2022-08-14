import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
	@ApiProperty()
	@Length(3)
	@IsString()
	message: string;

	@ApiProperty()
	@IsString()
	post: string;
}
