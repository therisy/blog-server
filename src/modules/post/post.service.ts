import { Snowflake } from "@libs/snowflake";
import { User } from "@modules/user/entities/user.entity";
import {
	ConflictException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostDTO } from "./dto/create-post.dto";
import { PatchPostDTO } from "./dto/patch-post.dto";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Post) private postRepository: Repository<Post>,
		private readonly jwtService: JwtService,
		private readonly snowflake: Snowflake,
	) {}

	async create(
		user: Auth.User,
		post: CreatePostDTO,
	): Promise<Blog.ReturnType<boolean>> {
		const data = await this.postRepository.findOne({
			uid: user.uid,
			title: post.title,
		});
		if (data) throw new ConflictException("this post already exists");

		const id = await this.snowflake.generate();

		await this.postRepository.save({
			pid: id,
			uid: user.uid,
			title: post.title,
			description: post.description,
			short_description: post.short_description,
			like: 0,
		});

		return {
			statusCode: HttpStatus.CREATED,
			message: "successful",
			data: true,
		};
	}

	async updatePost(
		user: Auth.User,
		id: string,
		field: PatchPostDTO,
	): Promise<Blog.ReturnType<boolean>> {
		const data = await this.postRepository.findOne({
			uid: user.uid,
			pid: id,
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
			{ uid: user.uid, pid: id },
			{ title, description, short_description },
		);

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}

	async deletePost(
		user: Auth.User,
		id: string,
	): Promise<Blog.ReturnType<boolean>> {
		const data = await this.postRepository.findOne({
			uid: user.uid,
			pid: id,
		});
		if (!data) throw new NotFoundException();

		await this.postRepository.delete({ uid: user.uid, pid: id });

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}
}
