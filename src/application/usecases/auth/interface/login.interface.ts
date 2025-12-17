import { LoginDTO } from "../../../../application/dtos/auth/login.dto";
import { AuthResult } from "../../../../domain/types/auth/auth.result.types";

export interface ILoginUseCase{
    execute(dto:LoginDTO):Promise<AuthResult>
}


