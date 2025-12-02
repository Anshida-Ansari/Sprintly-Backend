import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { RefreshResult } from "src/domain/types/auth/refresh.result.types";

export interface IRefreshUseCase{
    execute(refreshToken: string):Promise<RefreshResult>
}