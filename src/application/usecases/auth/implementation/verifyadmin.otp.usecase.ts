import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { IVerifyOtpUseCase } from "../interface/verifyadmin.otp.interface";
import { VerifyOtpDTO } from "../../../dtos/auth/verify.admin.dto";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { UserPersistenceMapper } from "../../../../infrastructure/mappers/user.percistance.mapper";
import { CompanyPersistenceMapper } from "../../../../infrastructure/mappers/company.persistance.mapper";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { UserEntity } from "../../../../domain/entities/user.entities";
import { CompanyEnitiy } from "../../../../domain/entities/company.enities";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { Status } from "../../../../domain/enum/user/user.status.enum";
import { UserStatus } from "../../../../domain/enum/status.enum";


@injectable()
export class VerifyAdminOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject(USER_TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(USER_TYPES.UserPersistenceMapper)
    private readonly _userPersistance: UserPersistenceMapper,

    @inject(COMPANY_TYPES.ICompanyRepository)
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