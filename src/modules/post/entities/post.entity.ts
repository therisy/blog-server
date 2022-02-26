import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail } from "class-validator";

@Entity()
export class PostSchema {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	pid: string;

	@Column()
	uid: string;

	@Column()
	@Length(4)
	title: string;

	@Column()
	@Length(3, 20)
	short_description: string;

	@Column()
	@Length(20)
	description: string;

	@Column()
	like: number;
}
