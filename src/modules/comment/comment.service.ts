import { PostSchema } from "@modules/post/etc/post.entity";
import { User } from "@modules/user/etc/user.entity";
import {  BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommentDTO } from "./etc/create-comment.dto";
import { Comment } from "./etc/comment.entity";

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(Comment)
		private commentRepository: Repository<Comment>,
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
	) { }

	async getCommentsByPost(post: string) {
		const model = await this.postRepository.findOne({ id: post });
		if (!model) throw new NotFoundException();

		const comments = await this.commentRepository.find({ post });

		return comments;
	}

	async addComment(
		user,
		id: string,
		field: CreateCommentDTO,
	): Promise<boolean> {
		const post = await this.postRepository.findOne({ id });
		if (!post) throw new NotFoundException('Post not found');

		await this.commentRepository.save({
			post: id,
			user: user.id,
			message: field.message,
		});

		return true;
	}

	async updateComment(
		user,
		id: string,
		field: CreateCommentDTO,
	): Promise<boolean> {
		const post = await this.commentRepository.findOne({ id });
		if (!post) throw new NotFoundException();

		let message =
			!!field.message && field.message != post.message
				? field.message
				: post.message;

		await this.commentRepository.update({ id, post: field.post, user: user.id }, { message });

		return true;
	}

	async deleteComment(
		id: string,
		post: string,
		user
	): Promise<boolean> {
		const postModel = await this.commentRepository.findOne({ id: post });
		if (!postModel) throw new NotFoundException();

		const model = await this.commentRepository.findOne({ id });
		if (!model) throw new NotFoundException();

		if (model.user != user.id) throw new UnauthorizedException();
		if (post != model.post) throw new BadRequestException();

		await this.commentRepository.delete({
			id
		})

		return true;
	}
}
