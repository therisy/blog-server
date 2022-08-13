import { Snowflake } from "@libs/snowflake";
import { Like } from "@modules/like/entities/like.entities";
import { LikeService } from "@modules/like/like.service";
import { User } from "@modules/user/etc/user.entity";
import { UserService } from "@modules/user/user.service";
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
import { PostSchema } from "./entities/post.entity";

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
		@InjectRepository(Like) private likeRepository: Repository<Like>,
		private readonly snowflake: Snowflake,
	) {}

	async getAll() {
		const data = await this.postRepository.find();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: data.map((v) => {
				return {
					title: v.title,
					description: v.description,
					short_description: v.short_description,
					uid: v.uid,
					username: "test",
					like: v.like,
					pid: v.pid,
				};
			}),
		};
	}

	async create(
		user,
		post: CreatePostDTO,
	) {
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

		return true;
	}

	async findOnePostById(
		id: string,
	) {
		const data = await this.postRepository.findOne({
			pid: id,
		});
		console.log(data);
		if (!data) throw new NotFoundException();

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: {
				title: data.title,
				description: data.description,
				short_description: data.short_description,
				uid: data.uid,
				username: "test",
				like: data.like,
				pid: data.pid,
			},
		};
	}

	async updatePost(
		user,
		id: string,
		field: PatchPostDTO,
	): Promise<boolean> {
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

		return true;
	}

	async deletePost(
		user,
		id: string,
	): Promise<boolean> {
		const data = await this.postRepository.findOne({
			uid: user.uid,
			pid: id,
		});
		if (!data) throw new NotFoundException();

		await this.postRepository.delete({ uid: user.uid, pid: id });
		await this.likeRepository.delete({ uid: user.uid, pid: id });

		return true;
	}
}
