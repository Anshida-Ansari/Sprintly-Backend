import { inject, injectable } from "inversify";
import { ILoginUseCase } from "../interface/login.interface";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { LoginDTO } from "src/application/dtos/auth/login.dto";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { AuthResult } from "src/domain/types/auth/auth.result.types";
import { UserEntity } from "src/domain/entities/user.entities";
import { validateEmail } from "src/shared/utils/email.validate.util";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { generateAccessToken, generateRefreshToken, verifyToken } from "src/shared/utils/jwt.util";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { SuccessMessage } from "src/domain/enum/messages/success.message.enum";
import { verify } from "src/shared/utils/password.hash.util";
import { Status } from "src/domain/enum/user/user.status.enum";
import { COMPANY_TYPES } from "src/infrastructure/di/types/company/company.types";
import { ICompany } from "src/infrastructure/db/interface/company.interface";
import { ICompanyRepository } from "src/infrastructure/db/repository/interface/company.interface";
import { log } from "console";
import { companySchema } from "src/infrastructure/db/schema/company.schema";


@injectable()
export class LoginUseCase implements ILoginUseCase{
    constructor(
        @inject(USER_TYPES.UserRepository) 
        private _userRepository:IUserRepository,
        @inject(COMPANY_TYPES.CompanyRepository)
        private _companyRepository:ICompanyRepository
        
        
    ){}

    async execute(dto: LoginDTO): Promise<AuthResult> {
        try {
        console.log('reaching the login ');
             
        const {email,password} = dto

        const isValidEmail = validateEmail(email)
        if(!isValidEmail) throw new Error(ErrorMessage.EMAIL_INVALID)

        const user = await this._userRepository.findByEmail(email)
        if(!user) throw new Error(ErrorMessage.EMAIL_NOT_EXIST)

        user.isBlocked()    

        console.log('user',user);
        
        const isPasswrord = await verify(user.password,password)
        if(!isPasswrord)throw new Error(ErrorMessage.INVALID_PASSWORD)

        // if(user.role !== Role.SUPER_ADMIN){
        //     throw new Error(COMPANY_NOT_ASSOCIATED_TO_COMPANY)
        // }    

        if(user.role === Role.DEVELOPERS && !user.companyId){
            throw new Error(ErrorMessage.DEVELOPER_NOT_ASSIGNED_TO_COMPANY)
        }

        if(user.role === Role.ADMIN && !user.companyId){
            throw new Error(ErrorMessage.COMPANY_NOT_ASSOCIATED_TO_COMPANY)
        }

        if(!user.companyId){
            throw new Error(ErrorMessage.COMPANY_NOT_ASSOCIATED_TO_COMPANY)
         }


         console.log('trying to find compnayid',user.companyId)

        const compnay = await this._companyRepository.findByCompanyId(user.companyId)
        if(!compnay) throw new Error(ErrorMessage.COMPANY_NOT_FOUND)

          
            

        if(compnay.status !== Status.APPROVED){
         throw new Error(ErrorMessage.COMPANY_NOT_APPROVED)
        }   

        if(user.role === Role.ADMIN && compnay.status !== Status.APPROVED){
            throw new Error("Admin is not approved yet")
        }

        const payload = {id:user.id,email:user.email,role:user.role}    


        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        
        

        await redisClient.set(
            `refresh:${user.email}`,
            refreshToken,
            "EX",
            Number(process.env.REFRESH_TOKEN_MAX_AGE)
        )

        return{
            message:SuccessMessage.LOGIN_SUCCESS,
            accessToken,
            refreshToken,
            user:{
                id:user.id?.toString(),
                name:user.name,
                email:user.email,
                role:user.role,

            }
        }
        
        } catch (error) {
            throw error
        }
    }
} 