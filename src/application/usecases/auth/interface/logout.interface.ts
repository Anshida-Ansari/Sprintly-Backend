import { LogoutDTO } from "src/application/dtos/auth/logout.register.dto";

export interface ILogoutUseCase{
    execute(dto:LogoutDTO):Promise<void>
}