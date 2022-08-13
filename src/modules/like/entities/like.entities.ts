import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	pid: string;

	@Column()
	uid: string;
}
