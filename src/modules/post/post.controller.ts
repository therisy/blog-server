import { Roles } from "@decorators/role.decorator";
import { User } from "@decorators/user.decorator";
import { RoleTypes } from "@enums/role.enum";
import { JwtGuard } from "@guards/jwt.guard";
import { RolesGuard } from "@guards/role.guard";
import { CommentService } from "@modules/comment/comment.service";
import { CreateCommentDTO } from "@modules/comment/dto/create-comment.dto";
import { LikeService } from "@modules/like/like.service";
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
import { CreatePostDTO } from "./dto/create-post.dto";
import { PatchPostDTO } from "./dto/patch-post.dto";
import { PostSchema } from "./entities/post.entity";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly likeService: LikeService,
		private readonly commentService: CommentService,
	) {}

	@Get("/all")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	getAll(): Promise<Blog.ReturnType<any>> {
		return this.postService.getAll();
	}

	@Post("/create")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	create(
		@User() user,
		@Body() post: CreatePostDTO,
	): Promise<Blog.ReturnType<boolean>> {
		return this.postService.create(user, post);
	}

	@Get(":id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	findOnePostById(
		@Param("id") id: string,
	): Promise<Blog.ReturnType<Post.PostDetails>> {
		return this.postService.findOnePostById(id);
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

	@Post("/like/add/:id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	like(
		@User() user,
		@Param("id") id: string,
	): Promise<Blog.ReturnType<boolean>> {
		return this.likeService.like(user, id);
	}

	@Post("/like/remove/:id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	dislike(
		@User() user,
		@Param("id") id: string,
	): Promise<Blog.ReturnType<boolean>> {
		return this.likeService.dislike(user, id);
	}

	@Post("/comment/:id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	addComment(
		@User() user,
		@Param("id") id: string,
		@Body() field: CreateCommentDTO,
	): Promise<Blog.ReturnType<boolean>> {
		return this.commentService.addComment(user, id, field);
	}

	@Get("/comment/:id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	getComments(
		@Param("id") pid: string,
	): Promise<Blog.ReturnType<Post.Comment[]>> {
		return this.commentService.allComents(pid);
	}

	@Patch("/comment/:id")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	updateComment(
		@User() user,
		@Param("id") id: string,
		@Body() field: CreateCommentDTO,
	): Promise<Blog.ReturnType<boolean>> {
		return this.commentService.updateComment(user, id, field);
	}

	@Delete("/comment/:post/:msg")
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(RoleTypes.USER)
	deleteComment(
		@User() user,
		@Param("post") post: string,
		@Param("msg") msg: string,
	): Promise<Blog.ReturnType<boolean>> {
		return this.commentService.deleteComment(user, post, msg);
	}
}
