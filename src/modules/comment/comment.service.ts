import { Snowflake } from "@libs/snowflake";
import { PostSchema } from "@modules/post/entities/post.entity";
import { User } from "@modules/user/etc/user.entity";
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

	async allComents(pid: string) {
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
		user,
		id: string,
		field: CreateCommentDTO,
	): Promise<boolean> {
		const post = await this.postRepository.findOne({ pid: id });
		if (!post) throw new NotFoundException();

		const commentID = await this.snowflake.generate();

		await this.commentRepository.save({
			uid: user.uid,
			pid: id,
			cid: commentID,
			message: field.message,
		});

		return true;
	}

	async updateComment(
		user,
		id: string,
		field: CreateCommentDTO,
	): Promise<boolean> {
		const post = await this.commentRepository.findOne({ cid: id });
		if (!post) throw new NotFoundException();

		let message =
			!!field.message && field.message != post.message
				? field.message
				: post.message;

		await this.commentRepository.update({ cid: id }, { message });

		return true;
	}

	async deleteComment(
		user,
		pid: string,
		msg: string,
	): Promise<boolean> {
		const post = await this.commentRepository.findOne({ pid: pid });
		if (!post) throw new NotFoundException();

		const message = await this.commentRepository.findOne({ cid: msg });
		if (!message) throw new NotFoundException();

		await this.commentRepository.delete({ pid: pid, cid: msg });

		return true;
	}
}
