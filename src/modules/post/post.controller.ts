import { Role } from "@decorators/role.decorator";
import { User } from "@decorators/user.decorator";
import { RoleTypes } from "@enums/role.enum";
import { JwtGuard } from "@guards/jwt.guard";
import { RoleGuard } from "@guards/role.guard";
import {
	Controller,
	Post,
	Body,
	UseGuards,
	Patch,
	Param,
	Delete,
	Get,
} from "@nestjs/common";
import { CreatePostDTO } from "./etc/create-post.dto";
import { PatchPostDTO } from "./etc/update-post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(
		private readonly postService: PostService,
	) {}

	@Get("/all")
	@UseGuards(JwtGuard, RoleGuard)
	@Role(RoleTypes.USER)
	getAll() {
		return this.postService.getAll();
	}

	@Post("/create")
	@UseGuards(JwtGuard, RoleGuard)
	@Role(RoleTypes.USER)
	create(
		@User() user,
		@Body() post: CreatePostDTO,
	): Promise<boolean> {
		return this.postService.create(user, post);
	}

	@Get(":id")
	@UseGuards(JwtGuard, RoleGuard)
	@Role(RoleTypes.USER)
	getById(
		@Param("id") id: string,
	) {
		return this.postService.getById(id);
	}

	@Patch(":id")
	@UseGuards(JwtGuard, RoleGuard)
	@Role(RoleTypes.USER)
	update(
		@User() user,
		@Param("id") id: string,
		@Body() post: PatchPostDTO,
	): Promise<boolean> {
		return this.postService.update(user, id, post);
	}

	@Delete(":id")
	@UseGuards(JwtGuard, RoleGuard)
	@Role(RoleTypes.USER)
	delete(
		@User() user,
		@Param("id") id: string,
	): Promise<boolean> {
		return this.postService.delete(user, id);
	}
}
