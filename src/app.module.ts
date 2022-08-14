import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RateLimiterModule } from "nestjs-rate-limiter";
import { AppController } from "./app.controller";
import { UserModule } from "@modules/user/user.module";
import { User } from "@modules/user/etc/user.entity";
import { factory } from "./config";
import { PostModule } from "@modules/post/post.module";
import { PostSchema } from "@modules/post/etc/post.entity";
import { Like } from "@modules/like/etc/like.entities";
import { Comment } from "@modules/comment/etc/comment.entity";
import { LikeModule } from "@modules/like/like.module";

@Module({
	imports: [
		RateLimiterModule.register({
			points: 15,
			duration: 30,
			keyPrefix: "global",
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get<string>("POSTGRES.HOST"),
				port: configService.get<number>("POSTGRES.PORT"),
				username: configService.get<string>("POSTGRES.USERNAME"),
				password: configService.get<string>("POSTGRES.PASSWORD"),
				database: configService.get<string>("POSTGRES.DATABASE"),
				entities: [User, PostSchema, Like, Comment],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			load: [factory],
		}),
		UserModule,
		PostModule,
		LikeModule,
	],
	controllers: [AppController],
})
export class AppModule {}
