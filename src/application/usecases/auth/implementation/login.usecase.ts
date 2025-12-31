import { inject, injectable } from "inversify";
import { ILoginUseCase } from "../interface/login.interface";
import { LoginDTO } from "../../../dtos/auth/login.dto";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { AuthResult } from "../../../../domain/types/auth/auth.result.types";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { SuccessMessage } from "../../../../domain/enum/messages/success.message.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { Status } from "../../../../domain/enum/user/user.status.enum";
import { validateEmail } from "../../../../shared/utils/email.validate.util";
import { generateAccessToken, generateRefreshToken } from "../../../../shared/utils/jwt.util";
import { verify } from "../../../../shared/utils/password.hash.util";
import { NotFoundError } from "../../../../shared/utils/error-handling/errors/not.found.error";
import { validationError } from "../../../../shared/utils/error-handling/errors/validation.error";
import { ConflictError } from "../../../../shared/utils/error-handling/errors/conflict.error";
import { ForbiddenError } from "../../../../shared/utils/error-handling/errors/forbidden.error";
import env from "src/infrastructure/providers/env/env.validation";

@injectable()
export class LoginUseCase implements ILoginUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository,
        @inject(COMPANY_TYPES.ICompanyRepository)
        private _companyRepository: ICompanyRepository


    ) { }

    async execute(dto: LoginDTO): Promise<AuthResult> {
       
            console.log('reaching the login ');

            const { email, password } = dto

            const isValidEmail = validateEmail(email)
            if (!isValidEmail) throw new validationError(ErrorMessage.EMAIL_INVALID)

            const user = await this._userRepository.findByEmail(email)
            if (!user) throw new NotFoundError(ErrorMessage.EMAIL_NOT_EXIST)

            user.isBlocked()

            console.log('user', user);

            const isPasswrord = await verify(user.password, password)
            if (!isPasswrord) throw new validationError(ErrorMessage.INVALID_PASSWORD)

            if (user.role !== Role.SUPER_ADMIN) {

                if (user.role === Role.DEVELOPERS && !user.companyId) {
                    throw new ConflictError(ErrorMessage.DEVELOPER_NOT_ASSIGNED_TO_COMPANY)
                }

                if (user.role === Role.ADMIN && !user.companyId) {
                    throw new ConflictError(ErrorMessage.COMPANY_NOT_ASSOCIATED_TO_COMPANY)
                }

                if (!user.companyId) {
                    throw new ConflictError(ErrorMessage.COMPANY_NOT_ASSOCIATED_TO_COMPANY)
                }



                const company = await this._companyRepository.findByCompanyId(user.companyId)
                if (!company) throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND)




                if (company.status !== Status.APPROVED) {
                    throw new ForbiddenError(ErrorMessage.COMPANY_NOT_APPROVED)
                }

                if (user.role === Role.ADMIN && company.status !== Status.APPROVED) {
                    throw new ForbiddenError("Admin is not approved yet")
                }

            }

            const payload = { id: user.id, email: user.email, role: user.role }


            const accessToken = generateAccessToken(payload)
            const refreshToken = generateRefreshToken(payload)



            await redisClient.set(
                `refresh:${user.email}`,
                refreshToken,
                "EX",
                Number(env.REFRESH_TOKEN_MAX_AGE)
            )

            return {
                message: SuccessMessage.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                user: {
                    id: user.id?.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,

                }
            }

       
    }
} 