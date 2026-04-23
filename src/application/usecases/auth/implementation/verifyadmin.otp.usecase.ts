import type { VerifyOtpDTO } from "@application/dtos/auth/verify.admin.dto";
import type { IVerifyOtpUseCase } from "@application/usecases/auth/interface/verifyadmin.otp.interface";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import { CompanyEntity } from "@domain/entities/company.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { Role } from "@domain/enum/role.enum";
import { UserStatus } from "@domain/enum/status.enum";
import { Status } from "@domain/enum/user/user.status.enum";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";

import type { CompanyPersistenceMapper } from "@infrastructure/mappers/company.persistence.mapper";
import type { UserPersistenceMapper } from "@infrastructure/mappers/user.persistence.mapper";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

import { InternalServerError } from "@shared/utils/error-handling/errors/internal.server.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { validationError } from "@shared/utils/error-handling/errors/validation.error";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class VerifyAdminOtpUseCase implements IVerifyOtpUseCase {
	constructor(
		@inject(USER_TYPES.IUserRepository)
		private readonly _userRepository: IUserRepository,

		@inject(USER_TYPES.UserPersistenceMapper)
		private readonly _userPersistence: UserPersistenceMapper,

		@inject(COMPANY_TYPES.ICompanyRepository)
		private readonly _companyRepository: ICompanyRepository,

		@inject(COMPANY_TYPES.CompanyPersistenceMapper)
		private readonly _companyPersistence: CompanyPersistenceMapper,

		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,

		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {}

	async execute(dto: VerifyOtpDTO): Promise<{
		message: string;
		user: { id?: string; name: string; email: string };
		company: { id?: string; name: string };
	}> {
		const key = `admin.otp:${dto.token}`;
		const data = await redisClient.get(key);

		if (!data) {
			throw new NotFoundError(ErrorMessage.OTP_EXPIRED);
		}

		const parsed = JSON.parse(data);

		if (parsed.otp.toString() !== dto.otp.toString()) {
			throw new validationError(ErrorMessage.OTP_INVALID);
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

		const adminMongo = this._userPersistence.toMongo(adminEntity);
		const newAdmin = await this._userRepository.create(adminMongo);

		if (!newAdmin.id) throw new InternalServerError("Failed to create admin");

		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find((p) => p.price === 0);
		const planName = freePlan ? freePlan.name : "free";
		const projectLimit = freePlan ? freePlan.projectLimit : 2;

		const companyEntity = CompanyEntity.create({
			companyName: parsed.companyName,
			adminId: newAdmin.id.toString(),
			status: Status.PENDING,
			currentPlan: planName,
			projectLimit: projectLimit,
		});

		const companyMongo = this._companyPersistence.toMongo(companyEntity);
		const newCompany = await this._companyRepository.create(companyMongo);

		if (!newCompany.id)
			throw new InternalServerError(ErrorMessage.COMPANY_CREATION_FAILED);

		await this._userRepository.update(newAdmin.id, {
			companyId: newCompany.id.toString(),
		});

		await redisClient.del(key);

		try {
			const superAdmins = await this._userRepository.find(
				{ role: Role.SUPER_ADMIN },
				{ skip: 0, limit: 100 },
			);

			for (const admin of superAdmins) {
				if (admin.id) {
					await this._createNotificationUseCase.execute(
						admin.id.toString(),
						NotificationType.COMPANY_REGISTERED,
						`A new company, ${newCompany.companyName}, has registered. Please review the registration.`,
						newCompany.id?.toString() || "",
						"Company",
					);
				}
			}
		} catch (error) {
			console.error("Failed to notify superadmins of new registration:", error);
		}

		return {
			message: "Admin registered successfully",
			user: {
				id: newAdmin.id?.toString(),
				name: newAdmin.name,
				email: newAdmin.email,
			},
			company: {
				id: newCompany.id?.toString(),
				name: newCompany.companyName,
			},
		};
	}
}
