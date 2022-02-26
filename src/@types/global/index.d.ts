import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace Blog {
		interface ReturnType<T> {
			statusCode: HttpStatus;
			message: string;
			data: T;
		}
	}

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
	}

	namespace Post {
		interface PostDetails {
			title: string;
			description: string;
			short_description: string;
			uid: string;
			username: string;
			like: number;
			pid: string;
		}

		interface Comment {
			cid: string;
			message: string;
			uid: string;
			username: string;
		}
	}
}
