import type { CompanyEnitiy } from "../../../../domain/entities/company.enities";
import type { SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";
import type { Status } from "../../../../domain/enum/user/user.status.enum";
import type { IBaseRepository } from "./base.repository";

export interface ICompanyRepository extends IBaseRepository<CompanyEnitiy> {
	findByName(name: string): Promise<CompanyEnitiy | null>;
	findByStatus(status: Status): Promise<CompanyEnitiy[]>;
	findByAdminId(adminId: string): Promise<CompanyEnitiy | null>;
	findByCompanyId(companyId: string): Promise<CompanyEnitiy | null>;
	findByStripeCustomerId(customerId: string): Promise<CompanyEnitiy | null>;
	updatePlan(
		companyId: string,
		plan: SubscriptionPlan,
		projectLimit: number,
		stripeCustomerId?: string,
		stripeSubscriptionId?: string,
		subscriptionEndDate?: Date,
		autoRenew?: boolean,
	): Promise<CompanyEnitiy | null>;
}

