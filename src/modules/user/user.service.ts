import { ConflictException, HttpStatus, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "@modules/user/entities/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { SupaBaseService } from "@modules/supabase/supabase.service";
import { Snowflake } from "@libs/snowflake";
import { RoleTypes } from "@enums/role.enum";
import { PatchPasswordDTO } from "./dto/update-password.dto";
import { PatchUserDTO } from "./dto/patch-user.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly supabase: SupaBaseService,
		private readonly snowflake: Snowflake,

	) {}

	async createNewUser(
		field: CreateUserDTO,
	): Promise<Blog.ReturnType<string>> {
		const email = await this.userRepository.findOne({ email: field.email });
		if (email)
			throw new ConflictException(
				"This email address is already registered",
			);
		const id = await this.snowflake.generate();

		const body = {
			uid: id,
			username: field.username,
			password: await bcrypt.hash(field.password, 10),
			email: field.email,
			role: RoleTypes.USER
		};

		const user = await this.userRepository.save(body);

		const token = await this.createUserToken(user.uid);

		return {
			statusCode: HttpStatus.CREATED,
			message: "Account created",
			data: token
		};
	}

	async login(field: CreateUserDTO): Promise<Blog.ReturnType<string>>  {
		const user = await this.userRepository.findOne({ username: field.username, email: field.email });
		if(!user) throw new NotFoundException('User not found');

		const match = await bcrypt.compare(field.password, user.password);
		if(!match) throw new UnauthorizedException();

		const token = await this.createUserToken(user.uid);

		return {
			statusCode: HttpStatus.OK,
			message: "Login successful",
			data: token,
		};
	}

	async getUserInfo(user: Blog.User): Promise<Blog.ReturnType<Blog.JwtUser>> {
		const getUser = await this.userRepository.findOne({ uid: user.uid });
		if(!getUser) throw new NotFoundException('User not found');

		const token = await this.createUserToken(getUser.uid);

		return {
			statusCode: HttpStatus.OK,
			message: "Successful",
			data: {
				username: getUser.username,
				email: getUser.email,
				role: getUser.role,
				access_token: token
			},
		};
	}

	async updatePassword(
		user: Blog.User,
		password: PatchPasswordDTO,
	): Promise<Blog.ReturnType<string>> {
		const getUser = await this.userRepository.findOne({ uid: user.uid });
		if (!getUser) throw new NotFoundException("User not found");

		if (password.newPassword !== password.newPassword2)
			throw new NotAcceptableException(
				"new password and new password2 do not match",
			);

		const match = await bcrypt.compare(
			password.oldPassword,
			getUser.password,
		);
		if (!match)
			throw new UnauthorizedException("Old password doesn't matches");

		const newPassword = await bcrypt.hash(password.newPassword, 10);

		const body = {
			password: newPassword
		};

		await this.userRepository.update({ uid: user.uid, email: user.email}, body);

		const token = this.createUserToken(user.uid);

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: token
		};
	}

	async updateMy(
		user: Blog.User,
		newUser: PatchUserDTO,
	): Promise<Blog.ReturnType<string>> {
		const getUser = await this.userRepository.findOne({ uid: user.uid });
		if (!getUser) throw new NotFoundException("User not found");

		let username =
			!!newUser.username && newUser.username != getUser.username
				? newUser.username
				: getUser.username;
		let email =
			!!newUser.email && newUser.email != getUser.email
				? newUser.email
				: getUser.email;
	
		await this.userRepository.update({uid: getUser.uid, email: getUser.email},{username,email});
		
		const token = this.createUserToken(user.uid);

		return {
			statusCode: HttpStatus.OK,
			message: "successful",
			data: token,
		};
	}

	async deleteAccount(user: Blog.User): Promise<Blog.ReturnType<boolean>> {
		const getUser = await this.userRepository.findOne({ uid: user.uid });
		if (!getUser) throw new NotFoundException("User not found");
	
		await this.userRepository.delete({ uid: user.uid, email: user.email });

		return {
			statusCode: HttpStatus.OK,
			message: 'successful',
			data: true
		};
	}
 
	createUserToken(id: string): string {
		const token = this.jwtService.sign(
			{ uid: id },
			{
				expiresIn: 1000 * 60 * 60 * 24 * 365,
			},
		);
		return token;
	}
}
