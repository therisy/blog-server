import * as dotenv from "dotenv";

dotenv.config();

export const factory = () => ({
	API_VERSION: (process.env.API_VERSION as string) || "v1",
	JWT_SECRET: process.env.JWT_SECRET as string,
	SUPABASE: {
		KEY: process.env.SUPABASE_KEY as string,
	},
	POSTGRES: {
		USERNAME: process.env.POSTGRES_USERNAME as string,
		PASSWORD: process.env.POSTGRES_PASSWORD as string,
		HOST: process.env.POSTGRES_HOST as string,
		PORT: process.env.POSTGRES_PORT,
		DATABASE: process.env.POSTGRES_DATABASE as string,
	},
});

export const CONFIG = factory();
