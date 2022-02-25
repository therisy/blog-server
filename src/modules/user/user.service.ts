import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "@modules/user/entities/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async createNewUser(
		field: CreateUserDTO,
	): Promise<Blog.ReturnType<Blog.Jwt>> {
		const email = await this.userRepository.findOne({ email: field.email });
		if (email)
			throw new ConflictException(
				"This email address is already registered",
			);

		field.password = await bcrypt.hash(field.password, 10);
		const user = await this.userRepository.save(field);

		const token = await this.createUserToken(user.id);

		return {
			statusCode: HttpStatus.CREATED,
			message: "Account Created",
			data: { access_token: token },
		};
	}

	createUserToken(id: number): string {
		const token = this.jwtService.sign(
			{ id },
			{
				expiresIn: 1000 * 60 * 60 * 24 * 365,
			},
		);
		return token;
	}
}
