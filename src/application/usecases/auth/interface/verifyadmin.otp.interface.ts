import type { VerifyOtpDTO } from "../../../../application/dtos/auth/verify.admin.dto";

export interface IVerifyOtpUseCase {
	execute(dto: VerifyOtpDTO): Promise<{
		message: string;
		user: {
			id?: string;
			name: string;
			email: string;
		};
		company: {
			id?: string;
			name: string;
		};
	}>;
}
