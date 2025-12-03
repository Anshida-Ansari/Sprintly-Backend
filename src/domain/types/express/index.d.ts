declare global {
    namespace Express {
        interface Request {
            user:{
                id: string,
                email: string,
                role: string,
                companyId: string,
                iat?: number;
                exp?: number;                
            }
        }
    }
}

export {};