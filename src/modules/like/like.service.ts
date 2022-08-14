import { PostSchema } from "@modules/post/etc/post.entity";
import { User } from "@modules/user/etc/user.entity";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Like } from "./etc/like.entities";

@Injectable()
export class LikeService {
	constructor(
		@InjectRepository(PostSchema)
		private postRepository: Repository<PostSchema>,
		@InjectRepository(Like) private likeRepository: Repository<Like>,
	) {}

	async like(id: string, user): Promise<boolean> {
		const post = await this.postRepository.findOne({ id, });
		if (!post) throw new NotFoundException();

		const data = await this.likeRepository.findOne({
			id,
			user: user.id,
		});
		if (data) {
			await this.likeRepository.delete({
				post: id,
				user: user.id,
			});

			return true;
		}

		await this.likeRepository.save({
			post: id,
			user: user.id,
		});

		return true;
	}
}
