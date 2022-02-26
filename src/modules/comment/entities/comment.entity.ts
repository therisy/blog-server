import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	pid: string;

	@Column({ nullable: true })
	cid: string;

	@Column()
	uid: string;

	@Column()
	@Length(3)
	message: string;
}
