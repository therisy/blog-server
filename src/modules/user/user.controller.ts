import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	UseGuards,
	Delete,
	Put,
} from "@nestjs/common";
import { JwtGuard } from "@guards/jwt.guard";
import { UserService } from "./user.service";
import { CreateUserDto } from "./etc/create-user.dto";
import { User } from "@decorators/user.decorator";
import { PatchPasswordDto } from "./etc/update-password.dto";
import { UpdateUserDto } from "./etc/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags('User')
export class UserController {
	constructor(private readonly service: UserService) {}

	@Post("/create")
	create(@Body() field: CreateUserDto) {
		return this.service.create(field);
	}

	@Get("/@me")
	@UseGuards(JwtGuard)
	getMe(@User() user) {
		return this.service.getMe(user);
	}

	@Patch("/@me")
	@UseGuards(JwtGuard)
	updateMe(
		@User() user,
		@Body() dto: UpdateUserDto,
	): Promise<boolean> {
		return this.service.updateMe(user, dto);
	}

	@Put("/password")
	@UseGuards(JwtGuard)
	updatePassword(
		@User() user,
		@Body() password: PatchPasswordDto,
	): Promise<boolean> {
		return this.service.updatePassword(user, password);
	}

	@Delete("/@me")
	@UseGuards(JwtGuard)
	delete(@User() user): Promise<boolean> {
		return this.service.delete(user);
	}
}
