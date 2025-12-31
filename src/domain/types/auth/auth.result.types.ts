import { Role } from "src/domain/enum/role.enum";
import { Status } from "src/domain/enum/user/user.status.enum";

export type AuthResult = {
	message: string;
	user?: {
		id?: string;
		name: string;
		email: string;
		role: string;
		companyName?: string;
	};
	accessToken: string;
	refreshToken: string;
};
