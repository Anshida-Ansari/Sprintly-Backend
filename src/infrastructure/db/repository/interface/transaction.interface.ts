import type { IBaseRepository } from "./base.repository";

export interface TransactionEntity {
	id?: string;
	stripePaymentId: string;
	stripeCustomerId: string;
	companyId: string;
	amount: number;
	currency: string;
	status: string;
	billingReason?: string;
	createdAt?: Date;
}

export interface ITransactionRepository
	extends IBaseRepository<TransactionEntity> {
	findByStripePaymentId(paymentId: string): Promise<TransactionEntity | null>;
	findByCompanyId(companyId: string): Promise<TransactionEntity[]>;
	getRevenueStats(): Promise<{ totalRevenue: number; monthlyRevenue: number }>;
}
