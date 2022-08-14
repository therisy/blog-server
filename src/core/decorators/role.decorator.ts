import { SetMetadata } from "@nestjs/common";
import { RoleTypes } from "@enums/role.enum";

export const Role = (role: RoleTypes) => SetMetadata("role", role);
