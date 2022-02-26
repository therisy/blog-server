import { RoleTypes } from "@enums/role.enum";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/core/decorators/role.decorator";
import { JwtGuard } from "@guards/jwt.guard";
import { RolesGuard } from "@guards/role.guard";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "@decorators/user.decorator"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/create')
	create(@Body() field: CreateUserDTO): Promise<Blog.ReturnType<Blog.Jwt>> {
		return this.userService.createNewUser(field);
	}

	@Post('/login')
	login(@Body() field: CreateUserDTO): Promise<Blog.ReturnType<Blog.Jwt>> {
		return this.userService.login(field);
	}

	
	@Get('/@me')
	@UseGuards(JwtGuard)
	getUser(@User() user: Blog.User) : Promise<Blog.ReturnType<Blog.JwtUser>> {
		return this.userService.getUserInfo(user);
	}
}
