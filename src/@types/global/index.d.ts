import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace Auth {
		interface User {
			uid?: string;
			username: string;
			email: string;
			role: number;
		}

		interface JwtUser extends User {
			access_token: string;
		}

		interface ReturnType<T> {
			statusCode: HttpStatus;
			message: string;
			data: T;
		}
	}

	namespace Post {}
}