import { SetMetadata } from "@nestjs/common";
import { RoleTypes } from "@enums/role.enum";

export const Roles = (...roles: RoleTypes[]) => SetMetadata("roles", roles);
