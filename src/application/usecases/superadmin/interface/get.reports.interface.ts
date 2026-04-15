export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export interface SubscriptionReportItem {
	companyName: string;
	plan: string;
	startDate: Date | string;
	endDate: Date | string;
	status: "Active" | "Expired" | "Expiring Soon";
	autoRenew: boolean;
}

export interface PaymentReportItem {
	paymentId: string;
	customerId: string;
	companyName: string;
	amount: number;
	status: string;
	date: Date | string;
}

export interface TrialReportItem {
	companyName: string;
	projectCount: number;
	projectLimit: number;
	createdAt: Date | string;
}

export interface IGetSubscriptionReportsUseCase {
	getSubscriptions(page: number, limit: number): Promise<PaginatedResult<SubscriptionReportItem>>;
	getPayments(page: number, limit: number): Promise<PaginatedResult<PaymentReportItem>>;
	getExpiringSoon(page: number, limit: number): Promise<PaginatedResult<SubscriptionReportItem>>;
	getTrials(page: number, limit: number): Promise<PaginatedResult<TrialReportItem>>;
}
