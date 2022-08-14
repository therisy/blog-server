import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/user/etc/user.entity";
import { PostSchema } from "./etc/post.entity";
import { UserService } from "@modules/user/user.service";
import { LikeService } from "@modules/like/like.service";
import { Like } from "@modules/like/etc/like.entities";
import { CommentService } from "@modules/comment/comment.service";
import { Comment } from "@modules/comment/etc/comment.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, PostSchema, Like, Comment]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [PostController],
	providers: [
		PostService,
		UserService,
		LikeService,
		CommentService,
	],
})
export class PostModule {}
