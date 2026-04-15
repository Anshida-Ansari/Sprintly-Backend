import { inject, injectable } from "inversify";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";

export interface IGetSubscriptionAnalyticsUseCase {
	execute(): Promise<{
		totalCompanies: number;
		proCompanies: number;
		freeCompanies: number;
		mrr: number;
		companies: Array<{
			id: string;
			companyName: string;
			currentPlan: string;
			subscriptionEndDate: string | null;
			stripeSubscriptionId: string | null;
			stripeCustomerId: string | null;
		}>;
	}>;
}

const PRO_PRICE_INR = 469;

@injectable()
export class GetSubscriptionAnalyticsUseCase implements IGetSubscriptionAnalyticsUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute() {
		const allCompanies = await this._companyRepository.findAll();

		const proCompanies = allCompanies.filter(
			(c) => c.currentPlan === SubscriptionPlan.PRO,
		);
		const freeCompanies = allCompanies.filter(
			(c) => c.currentPlan === SubscriptionPlan.FREE,
		);

		const mrr = proCompanies.length * PRO_PRICE_INR;

		const companies = allCompanies.map((c) => ({
			id: c.id || "",
			companyName: c.companyName,
			currentPlan: c.currentPlan,
			subscriptionEndDate: c.subscriptionEndDate
				? c.subscriptionEndDate.toISOString()
				: null,
			stripeSubscriptionId: c.stripeSubscriptionId ?? null,
			stripeCustomerId: c.stripeCustomerId ?? null,
		}));

		return {
			totalCompanies: allCompanies.length,
			proCompanies: proCompanies.length,
			freeCompanies: freeCompanies.length,
			mrr,
			companies,
		};
	}
}
