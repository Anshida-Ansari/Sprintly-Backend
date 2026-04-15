import { inject, injectable } from "inversify";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import { SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";
import type { IGetSubscriptionMetricsUseCase, SubscriptionStats } from "../interface/get.analytics.interface";

@injectable()
export class GetSubscriptionMetricsUseCase implements IGetSubscriptionMetricsUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute(): Promise<SubscriptionStats> {
		const companies = await this._companyRepository.findAll();
		const now = new Date();

		const totalUsers = companies.length;
		const freeUsers = companies.filter((c) => c.currentPlan === SubscriptionPlan.FREE).length;
		const paidUsers = companies.filter((c) => c.currentPlan === SubscriptionPlan.PRO).length;

		const activeSubscriptions = companies.filter(
			(c) => c.currentPlan === SubscriptionPlan.PRO && c.subscriptionEndDate && c.subscriptionEndDate > now
		).length;

		const expiredSubscriptions = companies.filter(
			(c) => c.currentPlan === SubscriptionPlan.PRO && c.subscriptionEndDate && c.subscriptionEndDate <= now
		).length;

		const planDistribution = [
			{ name: "Free", value: freeUsers },
			{ name: "Pro", value: paidUsers },
		];

		// Growth Trends (last 7 days)
		const growthTrends = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
			
			const count = companies.filter((c) => {
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
