import { RoleTypes } from "@enums/role.enum";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		let role = this.reflector.get<number>(
			"role",
			context.getHandler(),
		);
		if (!role) role = RoleTypes.ADMIN;

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) return false;

		return role <= user.role;
	}
}
