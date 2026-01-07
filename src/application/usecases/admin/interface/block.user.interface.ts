import { UserStatus } from "../../../../domain/enum/status.enum";

export interface IBlockUserUseCase {
    execute(userId: string, status: UserStatus): Promise<{ message: string }>;
}
