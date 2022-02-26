import { Body, Controller, Get, Patch, Post, UseGuards, Delete } from "@nestjs/common";
import { JwtGuard } from "@guards/jwt.guard";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "@decorators/user.decorator"
import { PatchPasswordDTO } from "./dto/update-password.dto";
import { PatchUserDTO } from "./dto/patch-user.dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/create')
	create(@Body() field: CreateUserDTO): Promise<Blog.ReturnType<string>> {
		return this.userService.createNewUser(field);
	}

	@Post('/login')
	login(@Body() field: CreateUserDTO): Promise<Blog.ReturnType<string>> {
		return this.userService.login(field);
	}

	@Get('/@me')
	@UseGuards(JwtGuard)
	getUser(@User() user: Blog.User): Promise<Blog.ReturnType<Blog.JwtUser>> {
		return this.userService.getUserInfo(user);
	}

	@Patch('/@me')
	@UseGuards(JwtGuard)
	updateMy(@User() user: Blog.User, @Body() field: PatchUserDTO): Promise<Blog.ReturnType<string>> {
		return this.userService.updateMy(user, field);
	}

	@Patch('/password')
	@UseGuards(JwtGuard)
	updatePassword(@User() user: Blog.User, @Body() password: PatchPasswordDTO): Promise<Blog.ReturnType<string>> {
		return this.userService.updatePassword(user, password);
	}

	@Delete('/@me')
	@UseGuards(JwtGuard)
	deleteAccount(@User() user: Blog.User): Promise<Blog.ReturnType<boolean>> {
		return this.userService.deleteAccount(user);
	}
}
