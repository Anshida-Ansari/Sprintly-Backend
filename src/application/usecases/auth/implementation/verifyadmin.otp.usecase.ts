import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import { CompanyEnitiy } from "@domain/entities/company.enities";
import { UserEntity } from "@domain/entities/user.entities";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { Role } from "@domain/enum/role.enum";
import { UserStatus } from "@domain/enum/status.enum";
import { Status } from "@domain/enum/user/user.status.enum";

import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";

import type { CompanyPersistenceMapper } from "@infrastructure/mappers/company.persistance.mapper";
import type { UserPersistenceMapper } from "@infrastructure/mappers/user.percistance.mapper";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { InternalServerError } from "@shared/utils/error-handling/errors/internal.server.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { validationError } from "@shared/utils/error-handling/errors/validation.error";

import type { VerifyOtpDTO } from "@application/dtos/auth/verify.admin.dto";
import type { IVerifyOtpUseCase } from "@application/usecases/auth/interface/verifyadmin.otp.interface";


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
    
      const key = `admin.otp:${dto.token}`
      const data = await redisClient.get(key)

      if (!data) {
        throw new NotFoundError(ErrorMessage.OTP_EXPIRED)
      }

      const parsed = JSON.parse(data)

      if (parsed.otp.toString() !== dto.otp.toString()) {
        throw new validationError(ErrorMessage.OTP_INVALID)
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


      const adminMongo = this._userPersistance.toMongo(adminEntity)
      const newAdmin = await this._userRepository.create(adminMongo);
      console.log("DATA GOING TO MONGO:");

      if (!newAdmin.id) throw new InternalServerError("Failed to create admin");

      const companyEntity = CompanyEnitiy.create({
        companyName: parsed.companyName,
        adminId: newAdmin.id.toString(),
        status: Status.PENDING, 
      });

      const companyMongo = this._companyPersistance.toMongo(companyEntity)
      const newCompany = await this._companyRepository.create(companyMongo);

      if (!newCompany.id) throw new InternalServerError(ErrorMessage.COMPANY_CREATION_FAILED);

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
  }



}