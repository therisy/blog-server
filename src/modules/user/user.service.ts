import {
	ConflictException,
	HttpStatus,
	Injectable,
	NotAcceptableException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "@modules/user/etc/user.entity";
import { CreateUserDto } from "./etc/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { RoleTypes } from "@enums/role.enum";
import { PatchPasswordDto } from "./etc/update-password.dto";
import { UpdateUserDto } from "./etc/update-user.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) { }

	async create(
		field: CreateUserDto,
	) {
		const email = await this.userRepository.findOne({ email: field.email });
		if (email)
			throw new ConflictException(
				"This email address is already registered",
			);

		const body = {
			username: field.username,
			password: await bcrypt.hash(field.password, 10),
			email: field.email,
			role: RoleTypes.USER,
		};

		await this.userRepository.save(body);

		return;
	}

	async getMe(user) {
		return user
	}

	async getUserName(id: string): Promise<string> {
		let data = await this.userRepository.findOne({ id });
		return data.username;
	}

	async getByEmail(email: string) {
		return await this.userRepository.findOne({ email })
	}

	async updatePassword(
		user,
		password: PatchPasswordDto,
	): Promise<boolean> {
		const model = await this.userRepository.findOne({ id: user.id });
		if (!model) throw new NotFoundException("User not found");

		if (password.newPassword !== password.newPassword2)
			throw new NotAcceptableException(
				"new password and new password2 do not match",
			);

		const match = await bcrypt.compare(
			password.oldPassword,
			model.password,
		);
		if (!match)
			throw new UnauthorizedException("Old password doesn't matches");

		const newPassword = await bcrypt.hash(password.newPassword, 10);

		const body = {
			password: newPassword,
		};

		await this.userRepository.update(
			{ id: user.id, email: user.email },
			body,
		);

		return true;
	}

	async updateMe(
		user,
		newUser: UpdateUserDto,
	): Promise<boolean> {
		const model = await this.userRepository.findOne({ id: user.id });
		if (!model) throw new NotFoundException("User not found");

		let username =
			!!newUser.username && newUser.username != model.username
				? newUser.username
				: model.username;
		let email =
			!!newUser.email && newUser.email != model.email
				? newUser.email
				: model.email;

		await this.userRepository.update(
			{ id: user.id, email: model.email },
			{ username, email },
		);

		return true;
	}

	async delete(user): Promise<boolean> {
		const getUser = await this.userRepository.findOne({ id: user.id });
		if (!getUser) throw new NotFoundException("User not found");

		await this.userRepository.delete({ email: user.email });

		return true
	}
}
