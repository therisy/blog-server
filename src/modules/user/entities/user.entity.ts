import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail } from "class-validator";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

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
