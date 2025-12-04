import { inject, injectable } from "inversify";
import { VerifyOtpDTO } from "src/application/dtos/auth/verify.admin.dto";
import { UserEntity } from "src/domain/entities/user.entities";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { Role } from "src/domain/enum/role.enum";
import { Status } from "src/domain/enum/user/user.status.enum";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { UserMapper, UserPersistenceMapper } from "src/infrastructure/mappers/user.percistance.mapper";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { IVerifyOtpUseCase } from "../interface/verifyadmin.otp.interface";
import { AUTH_TYPES } from "src/infrastructure/di/types/auth/auth.types";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { IUser } from "src/infrastructure/db/interface/user.interface";
import { COMPANY_TYPES } from "src/infrastructure/di/types/company/company.types";
import { ICompanyRepository } from "src/infrastructure/db/repository/interface/company.interface";
import { CompanyPersistenceMapper } from "src/infrastructure/mappers/company.persistance.mapper";
import { parse } from "path";
import { UserStatus } from "src/domain/enum/status.enum";
import { CompanyEnitiy } from "src/domain/entities/company.enities";
import { CompanyRepository } from "src/infrastructure/db/repository/implements/company.repositry";
import mongoose from "mongoose";
import { log } from "console";

@injectable()
export class VerifyAdminOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(USER_TYPES.UserPersistenceMapper)
    private readonly _userPersistance: UserPersistenceMapper,

    @inject(COMPANY_TYPES.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,

    @inject(COMPANY_TYPES.CompanyPersistenceMapper)
    private readonly _companyPersistance: CompanyPersistenceMapper
  ) { }

  async execute(dto: VerifyOtpDTO): Promise<{ message: string; user: { id?: string; name: string; email: string; }; company: { id?: string; name: string; }; }> {
    try {
      console.log('hello i am hitting')
      const key = `admin.otp:${dto.token}`
      const data = await redisClient.get(key)

      if (!data) {
        throw new Error(ErrorMessage.OTP_EXPIRED)
      }

      const parsed = JSON.parse(data)
      console.log('parsed data', parsed)

      if (parsed.otp.toString() !== dto.otp.toString()) {
        throw new Error(ErrorMessage.OTP_INVALID)
      }

      const tempCompanyId = new mongoose.Types.ObjectId().toString();

      const adminEntity = UserEntity.create({
        name: parsed.name,
        email: parsed.email,
        password: parsed.password,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        companyId: tempCompanyId,
        adminId: undefined,
      });

      console.log('adminEntity', adminEntity)

      // const hashedPassword = await adminEntity.getHashedPassword()
      // adminEntity.setPassword(hashedPassword)


      const adminMongo = this._userPersistance.toMongo(adminEntity)
      const newAdmin = await this._userRepository.create(adminMongo);
      console.log("DATA GOING TO MONGO:");

      if (!newAdmin.id) throw new Error("Failed to create admin");

      const companyEntity = CompanyEnitiy.create({
        companyName: parsed.companyName,
        adminId: newAdmin.id.toString(),
        status: Status.PENDING,
      });

      const companyMongo = this._companyPersistance.toMongo(companyEntity)
      const newCompany = await this._companyRepository.create(companyMongo);

      if (!newCompany.id) throw new Error(ErrorMessage.COMPANY_CREATION_FAILED);

      await this._userRepository.update(newAdmin.id, {
        companyId: newCompany.id.toString(),
      });

      console.log('new compnay', newCompany);
      await redisClient.del(key);
      console.log('admin', adminEntity)


      return {
        message: "Admin registered successfully",
        user: {
          id: newAdmin.id?.toString(),
          name: newAdmin.name,
          email: newAdmin.email
        },
        company: {
          id: newCompany.id?.toString(),
          name: newCompany.companyName
        }
      };



    } catch (error) {

      throw error
    }
  }



}