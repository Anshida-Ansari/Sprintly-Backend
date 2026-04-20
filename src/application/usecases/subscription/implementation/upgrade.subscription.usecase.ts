import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";
import {
	PROJECT_LIMITS,
	SubscriptionPlan,
} from "../../../../domain/enum/company/subscription.plan.enum";
import type { IUpgradeSubscriptionUseCase } from "../interface/upgrade.subscription.interface";

@injectable()
export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
	) {}

	async execute(
		companyId: string,
	): Promise<{ message: string; currentPlan: string }> {
		const company = await this._companyRepository.findByCompanyId(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		if (company.currentPlan === SubscriptionPlan.PRO) {
			return {
				message: "Company is already on the Pro plan",
				currentPlan: SubscriptionPlan.PRO,
			};
		}

		const proLimit = PROJECT_LIMITS[SubscriptionPlan.PRO]; // -1 (unlimited)

		await this._companyRepository.updatePlan(
			companyId,
			SubscriptionPlan.PRO,
			proLimit,
		);

		return {
			message: "Successfully upgraded to Pro plan",
			currentPlan: SubscriptionPlan.PRO,
		};
	}
}
