import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace Blog {
		interface User {
			id: string;
			username: string;
			email: string;
			password: string;
		}

		interface Jwt {
			access_token: strng;
		}

		interface ReturnType<T> {
			statusCode: HttpStatus;
			message: string;
			data: T;
		}
	}
}
