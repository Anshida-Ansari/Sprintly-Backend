import type { CompanyEntity } from "../../../../domain/entities/company.entity";

import type { Status } from "../../../../domain/enum/user/user.status.enum";
import type { IBaseRepository } from "./base.repository";

export interface ICompanyRepository extends IBaseRepository<CompanyEntity> {
	findByName(name: string): Promise<CompanyEntity | null>;
	findByStatus(status: Status): Promise<CompanyEntity[]>;
	findByAdminId(adminId: string): Promise<CompanyEntity | null>;
	findByCompanyId(companyId: string): Promise<CompanyEntity | null>;
	findByStripeCustomerId(customerId: string): Promise<CompanyEntity | null>;
	updatePlan(
		companyId: string,
		plan: string,
		projectLimit: number,
		stripeCustomerId?: string,
		stripeSubscriptionId?: string,
		subscriptionEndDate?: Date,
		autoRenew?: boolean,
	): Promise<CompanyEntity | null>;
}
