import { PostSchema } from "@modules/post/entities/post.entity";
import { User } from "@modules/user/entities/user.entity";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Like } from "./entities/like.entities";

@Injectable()
export class LikeService {
	constructor(
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Like) private likeRepository: Repository<Like>,
	) {}

	async like(user: Auth.User, id: string): Promise<Blog.ReturnType<boolean>> {
		const post = await this.postRepository.findOne({ pid: id });
		if (!post) throw new NotFoundException();

		const data = await this.likeRepository.findOne({
			uid: user.uid,
			pid: id,
		});
		if (data)
			return {
				statusCode: HttpStatus.CONFLICT,
				message: "unsuccessful",
				data: false,
			};

		await this.likeRepository.save({
			pid: id,
			uid: user.uid,
		});
		await this.postRepository.update({ pid: id }, { like: ++post.like });

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}

	async dislike(
		user: Auth.User,
		id: string,
	): Promise<Blog.ReturnType<boolean>> {
		const post = await this.postRepository.findOne({ pid: id });
		if (!post) throw new NotFoundException();

		const getLike = await this.likeRepository.findOne({
			pid: id,
			uid: user.uid,
		});
		if (!getLike) throw new NotFoundException();

		await this.likeRepository.delete({ pid: id, uid: user.uid });
		await this.postRepository.update({ pid: id }, { like: --post.like });

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: true,
		};
	}
}
