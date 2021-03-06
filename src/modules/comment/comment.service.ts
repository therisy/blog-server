import { Snowflake } from "@libs/snowflake";
import { PostSchema } from "@modules/post/entities/post.entity";
import { User } from "@modules/user/entities/user.entity";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Comment)
		private commentRepository: Repository<Comment>,
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
		private readonly snowflake: Snowflake,
	) {}

	async allComents(pid: string): Promise<Blog.ReturnType<Post.Comment[]>> {
		const post = await this.postRepository.findOne({ pid: pid });
		if (!post) throw new NotFoundException();

		const allComments = await this.commentRepository.find({ pid: pid });
		if (!allComments.length) throw new NotFoundException();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: allComments.map((v) => {
				return {
					cid: v.cid,
					message: v.message,
					uid: v.uid,
					username: "test",
				};
			}),
		};
	}

	async addComment(
		user: Auth.User,
		id: string,
		field: CreateCommentDTO,
	): Promise<Blog.ReturnType<boolean>> {
		const post = await this.postRepository.findOne({ pid: id });
		if (!post) throw new NotFoundException();

		const commentID = await this.snowflake.generate();

		await this.commentRepository.save({
			uid: user.uid,
			pid: id,
			cid: commentID,
			message: field.message,
		});

		return {
			statusCode: HttpStatus.CREATED,
			message: "successful",
			data: true,
		};
	}

	async updateComment(
		user: Auth.User,
		id: string,
		field: CreateCommentDTO,
	): Promise<Blog.ReturnType<boolean>> {
		const post = await this.commentRepository.findOne({ cid: id });
		if (!post) throw new NotFoundException();

		let message =
			!!field.message && field.message != post.message
				? field.message
				: post.message;

		await this.commentRepository.update({ cid: id }, { message });

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}

	async deleteComment(
		user: Auth.User,
		pid: string,
		msg: string,
	): Promise<Blog.ReturnType<boolean>> {
		const post = await this.commentRepository.findOne({ pid: pid });
		if (!post) throw new NotFoundException();

		const message = await this.commentRepository.findOne({ cid: msg });
		if (!message) throw new NotFoundException();

		await this.commentRepository.delete({ pid: pid, cid: msg });

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}
}
