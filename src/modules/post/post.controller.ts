import { Roles } from "@decorators/role.decorator";
import { User } from "@decorators/user.decorator";
import { RoleTypes } from "@enums/role.enum";
import { JwtGuard } from "@guards/jwt.guard";
import { RolesGuard } from "@guards/role.guard";
import {
	Controller,
	Post,
	Body,
	UseGuards,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { CreatePostDTO } from "./dto/create-post.dto";
import { PatchPostDTO } from "./dto/patch-post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post("/create")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	create(
		@User() user,
		@Body() post: CreatePostDTO,
	): Promise<Blog.ReturnType<boolean>> {
		return this.postService.create(user, post);
	}

	@Patch(":id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	update(
		@User() user,
		@Param("id") id: string,
		@Body() post: PatchPostDTO,
	): Promise<Blog.ReturnType<boolean>> {
		return this.postService.updatePost(user, id, post);
	}

	@Delete(":id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	delete(
		@User() user,
		@Param("id") id: string,
	): Promise<Blog.ReturnType<boolean>> {
		return this.postService.deletePost(user, id);
	}
}
