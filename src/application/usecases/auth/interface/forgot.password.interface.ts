import type { ForgotPasswordDTO } from "../../../../application/dtos/auth/forgot.password.dto";

export interface IForgotPasswordUseCase {
	execute(email: ForgotPasswordDTO): Promise<{
		message: string;
	}>;
}
