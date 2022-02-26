import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limiter";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "@modules/user/user.module";
import { User } from "@modules/user/entities/user.entity";
import { factory } from "./config";
import { PostModule } from "@modules/post/post.module";
import { PostSchema } from "@modules/post/entities/post.entity";
import { Like } from "@modules/like/entities/like.entities";
import { Comment } from "@modules/comment/entities/comment.entity";

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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
