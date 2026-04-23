import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import type { IUpgradeSubscriptionUseCase } from "../interface/upgrade.subscription.interface";

@injectable()
export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {}

	async execute(
		companyId: string,
	): Promise<{ message: string; currentPlan: string }> {
		const company = await this._companyRepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		// Find any 'Pro' plan in the database (e.g. "Pro Plan" or "Pro")
		const allPlans = await this._subscriptionPlanRepository.findAll();
		const proPlan = allPlans.find((p) => p.name.toLowerCase().includes("pro"));

		if (!proPlan) {
			throw new NotFoundError(
				"No plan with 'Pro' in the name found in database. Please create it first in Super Admin.",
			);
		}

		if (company.currentPlan === proPlan.name) {
			return {
				message: `Company is already on the ${proPlan.name} plan`,
				currentPlan: proPlan.name,
			};
		}

		await this._companyRepository.updatePlan(
			companyId,
			proPlan.name,
			proPlan.projectLimit,
		);

		return {
			message: `Successfully upgraded to ${proPlan.name} plan`,
			currentPlan: proPlan.name,
		};
	}
}
