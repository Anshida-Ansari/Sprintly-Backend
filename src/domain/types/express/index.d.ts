declare global {
	namespace Express {
		interface Request {
			user: {
				id: string;
				userId: string;   
                userName: string;
				email: string;
				role: string;
				companyId: string;
				adminId: string;
				iat?: number;
				exp?: number;
			};
		}
	}
}

export {};
