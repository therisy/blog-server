import { RoleTypes } from "@enums/role.enum";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/core/decorators/role.decorator";
import { JwtGuard } from "@guards/jwt.guard";
import { RolesGuard } from "@guards/role.guard";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() field: CreateUserDTO): Promise<Blog.ReturnType<Blog.Jwt>> {
		return this.userService.createNewUser(field);
	}
}
