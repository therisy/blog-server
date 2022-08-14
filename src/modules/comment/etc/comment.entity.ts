import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	post: string;

	@Column()
	user: string;

	@Column()
	@Length(3)
	message: string;
}
