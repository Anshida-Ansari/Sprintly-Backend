import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { AuthResult } from "src/domain/types/auth/auth.result.types";

export interface ILoginUseCase{
    execute(dto:LoginDTO):Promise<AuthResult>
}


