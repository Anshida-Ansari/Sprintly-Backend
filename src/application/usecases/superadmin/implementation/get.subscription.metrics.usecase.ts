import { inject, injectable } from "inversify";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { CompanyEntity } from "../../../../domain/entities/company.entity";
import type {
	IGetSubscriptionMetricsUseCase,
	SubscriptionStats,
} from "../interface/get.analytics.interface";

@injectable()
export class GetSubscriptionMetricsUseCase
	implements IGetSubscriptionMetricsUseCase
{
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {}

	async execute(): Promise<SubscriptionStats> {
		const companies = await this._companyRepository.findAll();
		const now = new Date();

		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find(p => p.price === 0);
		const freePlanName = freePlan ? freePlan.name : "Free";

		const totalUsers = companies.length;
		const freeUsers = companies.filter(
			(c: CompanyEntity) => c.currentPlan === freePlanName,
		).length;
		
		const paidUsers = companies.filter(
			(c: CompanyEntity) => c.currentPlan !== freePlanName,
		).length;

		const activeSubscriptions = companies.filter(
			(c: CompanyEntity) =>
				c.currentPlan !== freePlanName &&
				c.subscriptionEndDate &&
				c.subscriptionEndDate > now,
		).length;

		const expiredSubscriptions = companies.filter(
			(c: CompanyEntity) =>
				c.currentPlan !== freePlanName &&
				c.subscriptionEndDate &&
				c.subscriptionEndDate <= now,
		).length;

		// Dynamic Plan Distribution
		const planDistribution = allPlans.map(p => ({
			name: p.name,
			value: companies.filter((c: CompanyEntity) => c.currentPlan === p.name).length
		}));

		// Growth Trends (last 7 days)
		const growthTrends = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});

			const count = companies.filter((c: CompanyEntity) => {
				const createdAt = c.createdAt ? new Date(c.createdAt) : null;
				return createdAt && createdAt <= d;
			}).length;

			growthTrends.push({
				date: dateStr,
				count,
			});
		}

		return {
			totalUsers,
			freeUsers,
			paidUsers,
			activeSubscriptions,
			expiredSubscriptions,
			planDistribution,
			growthTrends,
		};
	}
}
