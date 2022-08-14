import * as dotenv from "dotenv";

dotenv.config();

export const factory = () => ({
	VERSION: process.env.VERSION || "1.0.0",
	JWT_SECRET: process.env.JWT_SECRET as string,
	ORIGINS: process.env.ORIGINS ? process.env.ORIGINS.split(",") : "",
	POSTGRES: {
		USERNAME: process.env.POSTGRES_USERNAME as string,
		PASSWORD: process.env.POSTGRES_PASSWORD as string,
		HOST: process.env.POSTGRES_HOST as string,
		PORT: process.env.POSTGRES_PORT,
		DATABASE: process.env.POSTGRES_DATABASE as string,
	},
});

export const CONFIG = factory();
