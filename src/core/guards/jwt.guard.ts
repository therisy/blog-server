import { User } from "@modules/user/entities/user.entity";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization;
		if (!token) return false;

		const decoded = this.jwtService.verify(token);
		if (decoded && decoded.uid) {
			const user = await this.userRepository.findOne({
				uid: decoded.uid,
			});

			request.user = {
				uid: user.uid,
				username: user.username,
				email: user.email,
				role: user.role,
			} as Auth.User;
			return true;
		}
		return false;
	}
}
