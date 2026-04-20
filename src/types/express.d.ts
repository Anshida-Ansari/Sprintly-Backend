declare global {
	namespace Express {
		interface User {
			id: string;
			userId: string;
			userName: string;
			email: string;
			role: string;
			companyId: string;
			adminId: string;
		}

		interface Request {
			user: User;
		}
	}
}
