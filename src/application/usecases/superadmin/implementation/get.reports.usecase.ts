import { inject, injectable } from "inversify";
import { COMPANY_TYPES } from "../../../../infrastructure/di/types/company/company.types";
import { TRANSACTION_TYPES } from "../../../../infrastructure/di/types/transaction/transaction.types";
import { PROJECT_TYPE } from "../../../../infrastructure/di/types/Project/project.types";
import type { ICompanyRepository } from "../../../../infrastructure/db/repository/interface/company.interface";
import type { ITransactionRepository } from "../../../../infrastructure/db/repository/interface/transaction.interface";
import type { IProjectReposiotory } from "../../../../infrastructure/db/repository/interface/project.interface";
import { SubscriptionPlan } from "../../../../domain/enum/company/subscription.plan.enum";
import type { 
    IGetSubscriptionReportsUseCase, 
    PaginatedResult, 
    SubscriptionReportItem, 
    PaymentReportItem, 
    TrialReportItem 
} from "../interface/get.reports.interface";

@injectable()
export class GetSubscriptionReportsUseCase implements IGetSubscriptionReportsUseCase {
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(TRANSACTION_TYPES.ITransactionRepository)
		private _transactionRepository: ITransactionRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectReposiotory,
	) {}

	async getSubscriptions(page: number, limit: number): Promise<PaginatedResult<SubscriptionReportItem>> {
		const skip = (page - 1) * limit;
		const companies = await this._companyRepository.findAll(); // Simplified for now, in real apps we use skip/limit in repo
		const total = companies.length;
		const now = new Date();

		const data = companies.slice(skip, skip + limit).map((c) => ({
			companyName: c.companyName,
			plan: c.currentPlan,
			startDate: c.createdAt || "N/A",
			endDate: c.subscriptionEndDate || "N/A",
			status: this._getStatus(c, now),
			autoRenew: c.autoRenew,
		}));

		return { data, total, page, limit };
	}

	async getPayments(page: number, limit: number): Promise<PaginatedResult<PaymentReportItem>> {
		const skip = (page - 1) * limit;
		const transactions = await this._transactionRepository.findAll();
		const total = transactions.length;
		const companies = await this._companyRepository.findAll();

		const data = transactions
			.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
			.slice(skip, skip + limit)
			.map((t) => {
				const company = companies.find((c) => c.id?.toString() === t.companyId?.toString());
				return {
					paymentId: t.stripePaymentId,
					customerId: t.stripeCustomerId,
					companyName: company?.companyName || "Unknown",
					amount: t.amount,
					status: t.status,
					date: t.createdAt || "N/A",
				};
			});

		return { data, total, page, limit };
	}

	async getExpiringSoon(page: number, limit: number): Promise<PaginatedResult<SubscriptionReportItem>> {
		const now = new Date();
		const in7Days = new Date();
		in7Days.setDate(now.getDate() + 7);

		const companies = await this._companyRepository.findAll();
		const expiring = companies.filter(
			(c) => c.currentPlan === SubscriptionPlan.PRO && 
                  c.subscriptionEndDate && 
                  c.subscriptionEndDate > now && 
                  c.subscriptionEndDate <= in7Days
		);

		const total = expiring.length;
		const skip = (page - 1) * limit;

		const data = expiring.slice(skip, skip + limit).map((c) => ({
			companyName: c.companyName,
			plan: c.currentPlan,
			startDate: c.createdAt || "N/A",
			endDate: c.subscriptionEndDate || "N/A",
			status: "Expiring Soon" as const,
			autoRenew: c.autoRenew,
		}));

		return { data, total, page, limit };
	}

	async getTrials(page: number, limit: number): Promise<PaginatedResult<TrialReportItem>> {
		const companies = await this._companyRepository.findAll();
		const projects = await this._projectRepository.findAll();

		const trials = companies.filter((c) => c.currentPlan === SubscriptionPlan.FREE);
		const total = trials.length;
		const skip = (page - 1) * limit;

		const data = trials.slice(skip, skip + limit).map((c) => {
			const projectCount = projects.filter((p) => p.companyId?.toString() === c.id?.toString()).length;
			return {
				companyName: c.companyName,
				projectCount,
				projectLimit: c.projectLimit,
				createdAt: c.createdAt || "N/A",
			};
		});

		return { data, total, page, limit };
	}

	private _getStatus(c: any, now: Date): "Active" | "Expired" | "Expiring Soon" {
		if (c.currentPlan === SubscriptionPlan.FREE) return "Active";
		if (!c.subscriptionEndDate) return "Active";
		if (c.subscriptionEndDate < now) return "Expired";
		
		const in7Days = new Date();
		in7Days.setDate(now.getDate() + 7);
		if (c.subscriptionEndDate <= in7Days) return "Expiring Soon";
		
		return "Active";
	}
}
