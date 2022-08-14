import { PostSchema } from "@modules/post/etc/post.entity";
import {  Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./etc/create-comment.dto";
import { Comment } from "./etc/comment.entity";
import { UpdateCommentDto } from "./etc/update-comment.dto";

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

	async create(
		id: string,
		field: CreateCommentDto,
		user,
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

	async update(
		id: string,
		dto: UpdateCommentDto,
		user,
	): Promise<boolean> {
		const post = await this.commentRepository.findOne({ id });
		if (!post) throw new NotFoundException();

		let message =
			!!dto.message && dto.message != post.message
				? dto.message
				: post.message;

		await this.commentRepository.update({ id, post: dto.post, user: user.id }, { message });

		return true;
	}

	async delete(
		id: string,
		user
	): Promise<boolean> {
		const model = await this.commentRepository.findOne({ id });
		if (!model) throw new NotFoundException();

		if (model.user != user.id) throw new UnauthorizedException();

		await this.commentRepository.delete({
			id
		})

		return true;
	}
}
