import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { Snowflake } from "@libs/snowflake";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/user/entities/user.entity";
import { PostSchema } from "./entities/post.entity";
import { UserService } from "@modules/user/user.service";
import { SupaBaseService } from "@modules/supabase/supabase.service";
import { LikeService } from "@modules/like/like.service";
import { Like } from "@modules/like/entities/like.entities";
import { CommentService } from "@modules/comment/comment.service";
import { Comment } from "@modules/comment/entities/comment.entity";

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
		Snowflake,
		UserService,
		SupaBaseService,
		LikeService,
		CommentService,
	],
})
export class PostModule {}
