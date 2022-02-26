import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "@modules/user/user.module";
import { User } from "@modules/user/entities/user.entity";
import { factory } from "./config";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get<string>("POSTGRES.HOST"),
				port: configService.get<number>("POSTGRES.PORT"),
				username: configService.get<string>("POSTGRES.USERNAME"),
				password: configService.get<string>("POSTGRES.PASSWORD"),
				database: configService.get<string>("POSTGRES.DATABASE"),
				entities: [User],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			load: [factory],
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
