import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { Snowflake } from "@libs/snowflake";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/user/entities/user.entity";
import { Post } from "./entities/post.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Post]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [PostController],
	providers: [PostService, Snowflake],
})
export class PostModule {}
