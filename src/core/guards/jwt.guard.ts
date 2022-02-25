import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization;
		if (!token) return false;

		const decoded = this.jwtService.verify(token);
		if (decoded && decoded.id) {
			request.user = decoded;
			return true;
		}
		return false;
	}
}
