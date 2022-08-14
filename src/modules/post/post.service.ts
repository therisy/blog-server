import { Like } from "@modules/like/etc/like.entities";
import {
	ConflictException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostDTO } from "./etc/create-post.dto";
import { PatchPostDTO } from "./etc/update-post.dto";
import { PostSchema } from "./etc/post.entity";

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
		@InjectRepository(Like) private likeRepository: Repository<Like>,
	) {}

	async getAll() {
		const data = await this.postRepository.find();

		return data
	}

	async create(
		user,
		post: CreatePostDTO,
	) {
		const data = await this.postRepository.findOne({
			user: user.id,
			title: post.title,
		});
		if (data) throw new ConflictException("this post already exists");

		await this.postRepository.save({
			user: user.id,
			title: post.title,
			description: post.description,
			short_description: post.short_description,
		});

		return true;
	}

	async getById(
		id: string,
	) {
		const data = await this.postRepository.findOne({
			id,
		});
		if (!data) throw new NotFoundException();

		return data;
	}

	async update(
		user,
		id: string,
		field: PatchPostDTO,
	): Promise<boolean> {
		const data = await this.postRepository.findOne({
			id,
			user: user.id
		});
		if (!data) throw new NotFoundException();

		let title =
			!!field.title && field.title != data.title
				? field.title
				: data.title;

		let description =
			!!field.description && field.description != data.description
				? field.description
				: data.description;

		let short_description =
			!!field.short_description &&
			field.short_description != data.short_description
				? field.short_description
				: data.short_description;

		await this.postRepository.update(
			{ id, user: user.id },
			{ title, description, short_description },
		);

		return true;
	}

	async delete(
		user,
		id: string,
	): Promise<boolean> {
		const data = await this.postRepository.findOne({
			user: user.id,
			id,
		});
		if (!data) throw new NotFoundException();

		await this.postRepository.delete({ id, user: user.id });
		await this.likeRepository.delete({ id, user: user.id });

		return true;
	}
}
