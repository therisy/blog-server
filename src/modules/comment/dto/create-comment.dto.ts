import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDTO {
	@ApiProperty()
	@Length(3)
	@IsString()
	message: string;
}
