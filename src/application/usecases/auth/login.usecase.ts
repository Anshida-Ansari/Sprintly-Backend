import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";

export class LoginUseCase{
    constructor(private userRepository:UserRepository){}

    async execute(dto:LoginDTO){
        try {
           
        } catch (error) {
            
        }
    }
}