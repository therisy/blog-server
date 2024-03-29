import { User } from "@modules/user/etc/user.entity";
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
		if (decoded && decoded.id) {
			const user = await this.userRepository.findOne({
				id: decoded.id,
			});

			request.user = {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			} as User;

			return true;
		}
		return false;
	}
}
