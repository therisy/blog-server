import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail } from "class-validator";
import { RoleTypes } from "@enums/role.enum";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: any;

	@Column({ nullable: true, default: RoleTypes.USER })
	role: number;

	@Column()
	@Length(4, 16)
	username: string;

	@Column()
	@IsEmail()
	email: string;

	@Column()
	@Length(7, 35)
	password: string;
}
