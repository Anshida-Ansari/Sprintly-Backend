import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import type { CompanyEntity } from "../../../../domain/entities/company.entity";

import type { Status } from "../../../../domain/enum/user/user.status.enum";
import { COMPANY_TYPES } from "../../../di/types/company/company.types";
import type { CompanyPersistenceMapper } from "../../../mappers/company.persistence.mapper";
import type { ICompanyRepository } from "../interface/company.interface";
import { BaseRepository } from "./base.repository";

@injectable()
export class CompanyRepository
	extends BaseRepository<CompanyEntity>
	implements ICompanyRepository
{
	constructor(
		@inject(COMPANY_TYPES.CompanyModel)
		model: Model<CompanyEntity>,
		@inject(COMPANY_TYPES.CompanyPersistenceMapper)
		private readonly _companyMapper: CompanyPersistenceMapper,
	) {
		super(model);
	}

	async findByName(name: string): Promise<CompanyEntity | null> {
		const doc = await this.findOne({ companyName: name });
		return doc ? this._companyMapper.fromMongo(doc) : null;
	}

	async findByStatus(status: Status): Promise<CompanyEntity[]> {
		const docs = await this.find({ status }, { limit: 10, skip: 12 });
		return docs.map((doc) => this._companyMapper.fromMongo(doc));
	}

	async findByAdminId(adminId: string): Promise<CompanyEntity | null> {
		const doc = await this.findOne({ adminId });
		return doc ? this._companyMapper.fromMongo(doc) : null;
	}

	async findByCompanyId(companyId: string): Promise<CompanyEntity | null> {
		const doc = await this.model.findById(companyId);
		if (!doc) return null;
		return this._companyMapper.fromMongo(doc);
	}

	async findByStripeCustomerId(
		customerId: string,
	): Promise<CompanyEntity | null> {
		const doc = await this.model.findOne({ stripeCustomerId: customerId });
		if (!doc) return null;
		return this._companyMapper.fromMongo(doc);
	}

	async updatePlan(
		companyId: string,
		plan: string,
		projectLimit: number,
		stripeCustomerId?: string,
		stripeSubscriptionId?: string,
		subscriptionEndDate?: Date,
		autoRenew?: boolean,
	): Promise<CompanyEntity | null> {
		const updatePayload: Record<string, unknown> = {
			currentPlan: plan,
			projectLimit,
		};
		if (stripeCustomerId !== undefined) {
			updatePayload.stripeCustomerId = stripeCustomerId;
		}
		if (stripeSubscriptionId !== undefined) {
			updatePayload.stripeSubscriptionId = stripeSubscriptionId;
		}
		if (subscriptionEndDate !== undefined) {
			updatePayload.subscriptionEndDate = subscriptionEndDate;
		}
		if (autoRenew !== undefined) {
			updatePayload.autoRenew = autoRenew;
		}
		const doc = await this.model.findByIdAndUpdate(
			companyId,
			{ $set: updatePayload },
			{ new: true },
		);
		return doc ? this._companyMapper.fromMongo(doc) : null;
	}
}
