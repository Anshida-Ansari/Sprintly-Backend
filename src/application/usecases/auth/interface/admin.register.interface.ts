import { AdminRegisterDTO } from "../../../../application/dtos/auth/admin.register.dto";

export interface IRegisterAdminUseCase{
    execute(dto: AdminRegisterDTO):Promise<{
        message: string;
        token: string;
    }>
}