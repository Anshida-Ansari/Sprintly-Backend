import type { LoginDTO } from "../../../../application/dtos/auth/login.dto";
import type { AuthResult } from "../../../../domain/types/auth/auth.result.types";

export interface ILoginUseCase {
	execute(dto: LoginDTO): Promise<AuthResult>;
}
