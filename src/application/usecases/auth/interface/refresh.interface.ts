import type { RefreshResult } from "../../../../domain/types/auth/refresh.result.types";

export interface IRefreshUseCase {
	execute(refreshToken: string): Promise<RefreshResult>;
}
