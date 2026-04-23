import type { CompanyEntity } from "@domain/entities/company.entity";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import { inject, injectable } from "inversify";

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

@injectable()
export class GetSubscriptionAnalyticsUseCase
	implements IGetSubscriptionAnalyticsUseCase
{
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {}

	async execute() {
		const allCompanies = await this._companyRepository.findAll();
		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find((p) => p.price === 0);
		const freePlanName = freePlan ? freePlan.name : "Free";

		const proCompanies = allCompanies.filter(
			(c: CompanyEntity) => c.currentPlan !== freePlanName,
		);
		const freeCompanies = allCompanies.filter(
			(c: CompanyEntity) => c.currentPlan === freePlanName,
		);

		// Calculate MRR dynamically based on current plan prices
		let mrr = 0;
		proCompanies.forEach((c: CompanyEntity) => {
			const plan = allPlans.find((p) => p.name === c.currentPlan);
			if (plan) mrr += plan.price;
		});

		const companies = allCompanies.map((c: CompanyEntity) => ({
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
