import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
	@PrimaryGeneratedColumn()
	id: any;

	@Column({
		type: String
	})
	post: string;

	@Column()
	user: string;
}
