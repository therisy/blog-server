import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail } from "class-validator";

@Entity()
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	pid: string;

	@Column()
	uid: string;
}
