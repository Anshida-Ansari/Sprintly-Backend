import type { CompanyEntity } from "@domain/entities/company.entity";
import type { ProjectEntity } from "@domain/entities/project.entity";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { IProjectRepository } from "@infrastructure/db/repository/interface/project.interface";
import type { ISubscriptionPlanRepository } from "@infrastructure/db/repository/interface/subscription.plan.interface";
import type {
	ITransactionRepository,
	TransactionEntity,
} from "@infrastructure/db/repository/interface/transaction.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { SUBSCRIPTION_PLAN_TYPES } from "@infrastructure/di/types/subscription-plan/subscription.plan.types";
import { TRANSACTION_TYPES } from "@infrastructure/di/types/transaction/transaction.types";
import { inject, injectable } from "inversify";
import type {
	IGetSubscriptionReportsUseCase,
	PaginatedResult,
	PaymentReportItem,
	SubscriptionReportItem,
	TrialReportItem,
} from "../interface/get.reports.interface";

@injectable()
export class GetSubscriptionReportsUseCase
	implements IGetSubscriptionReportsUseCase
{
	constructor(
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(TRANSACTION_TYPES.ITransactionRepository)
		private _transactionRepository: ITransactionRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectRepository,
		@inject(SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository)
		private _subscriptionPlanRepository: ISubscriptionPlanRepository,
	) {}

	async getSubscriptions(
		page: number,
		limit: number,
	): Promise<PaginatedResult<SubscriptionReportItem>> {
		const skip = (page - 1) * limit;
		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find((p) => p.price === 0);
		const freePlanName = freePlan ? freePlan.name : "Free";

		const companies = await this._companyRepository.findAll();
		const total = companies.length;
		const now = new Date();

		const data = companies
			.slice(skip, skip + limit)
			.map((c: CompanyEntity) => ({
				companyName: c.companyName,
				plan: c.currentPlan,
				startDate: c.createdAt || "N/A",
				endDate: c.subscriptionEndDate || "N/A",
				status: this._getStatus(c, now, freePlanName),
				autoRenew: c.autoRenew,
			}));

		return { data, total, page, limit };
	}

	async getPayments(
		page: number,
		limit: number,
	): Promise<PaginatedResult<PaymentReportItem>> {
		const skip = (page - 1) * limit;
		const transactions = await this._transactionRepository.findAll();
		const total = transactions.length;
		const companies = await this._companyRepository.findAll();

		const data = transactions
			.sort(
				(a: TransactionEntity, b: TransactionEntity) =>
					(b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
			)
			.slice(skip, skip + limit)
			.map((t: TransactionEntity) => {
				const company = companies.find(
					(c: CompanyEntity) => c.id?.toString() === t.companyId?.toString(),
				);
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

	async getExpiringSoon(
		page: number,
		limit: number,
	): Promise<PaginatedResult<SubscriptionReportItem>> {
		const now = new Date();
		const in7Days = new Date();
		in7Days.setDate(now.getDate() + 7);

		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find((p) => p.price === 0);
		const freePlanName = freePlan ? freePlan.name : "Free";

		const companies = await this._companyRepository.findAll();
		const expiring = companies.filter(
			(c: CompanyEntity) =>
				c.currentPlan !== freePlanName &&
				c.subscriptionEndDate &&
				c.subscriptionEndDate > now &&
				c.subscriptionEndDate <= in7Days,
		);

		const total = expiring.length;
		const skip = (page - 1) * limit;

		const data = expiring.slice(skip, skip + limit).map((c: CompanyEntity) => ({
			companyName: c.companyName,
			plan: c.currentPlan,
			startDate: c.createdAt || "N/A",
			endDate: c.subscriptionEndDate || "N/A",
			status: "Expiring Soon" as const,
			autoRenew: c.autoRenew,
		}));

		return { data, total, page, limit };
	}

	async getTrials(
		page: number,
		limit: number,
	): Promise<PaginatedResult<TrialReportItem>> {
		const companies = await this._companyRepository.findAll();
		const projects = await this._projectRepository.findAll();

		const allPlans = await this._subscriptionPlanRepository.findAll();
		const freePlan = allPlans.find((p) => p.price === 0);
		const freePlanName = freePlan ? freePlan.name : "Free";

		const trials = companies.filter(
			(c: CompanyEntity) => c.currentPlan === freePlanName,
		);
		const total = trials.length;
		const skip = (page - 1) * limit;

		const data = trials.slice(skip, skip + limit).map((c: CompanyEntity) => {
			const projectCount = projects.filter(
				(p: ProjectEntity) => p.companyId?.toString() === c.id?.toString(),
			).length;
			return {
				companyName: c.companyName,
				projectCount,
				projectLimit: c.projectLimit,
				createdAt: c.createdAt || "N/A",
			};
		});

		return { data, total, page, limit };
	}

	private _getStatus(
		c: CompanyEntity,
		now: Date,
		freePlanName: string,
	): "Active" | "Expired" | "Expiring Soon" {
		if (c.currentPlan === freePlanName) return "Active";
		if (!c.subscriptionEndDate) return "Active";
		if (c.subscriptionEndDate < now) return "Expired";

		const in7Days = new Date();
		in7Days.setDate(now.getDate() + 7);
		if (c.subscriptionEndDate <= in7Days) return "Expiring Soon";

		return "Active";
	}
}
