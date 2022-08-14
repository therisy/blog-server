import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./etc/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
