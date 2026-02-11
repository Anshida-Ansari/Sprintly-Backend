import type { LogoutDTO } from "@application/dtos/auth/logout.register.dto";

export interface ILogoutUseCase {
	execute(dto: LogoutDTO): Promise<void>;
}
