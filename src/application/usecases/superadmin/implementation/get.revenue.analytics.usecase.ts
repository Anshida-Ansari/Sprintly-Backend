import { inject, injectable } from "inversify";
import type { ITransactionRepository } from "../../../../infrastructure/db/repository/interface/transaction.interface";
import { TRANSACTION_TYPES } from "../../../../infrastructure/di/types/transaction/transaction.types";
import type {
	IGetRevenueAnalyticsUseCase,
	RevenueStats,
} from "../interface/get.analytics.interface";

@injectable()
export class GetRevenueAnalyticsUseCase implements IGetRevenueAnalyticsUseCase {
	constructor(
		@inject(TRANSACTION_TYPES.ITransactionRepository)
		private _transactionRepository: ITransactionRepository,
	) {}

	async execute(): Promise<RevenueStats> {
		const now = new Date();
		const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

		// Get all successful transactions
		const transactions = await this._transactionRepository.findAll();
		const successfulTx = transactions.filter((t) => t.status === "succeeded");

		const totalLifetimeRevenue = successfulTx.reduce(
			(acc, t) => acc + t.amount,
			0,
		);

		const currentMonthRevenue = successfulTx
			.filter((t) => t.createdAt && t.createdAt >= currentMonthStart)
			.reduce((acc, t) => acc + t.amount, 0);

		const previousMonthRevenue = successfulTx
			.filter(
				(t) =>
					t.createdAt &&
					t.createdAt >= prevMonthStart &&
					t.createdAt <= prevMonthEnd,
			)
			.reduce((acc, t) => acc + t.amount, 0);

		// Calculate MoM Growth
		let revenueGrowthPercentage = 0;
		if (previousMonthRevenue > 0) {
			revenueGrowthPercentage =
				((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
				100;
		} else if (currentMonthRevenue > 0) {
			revenueGrowthPercentage = 100;
		}

		// Revenue history for chart (last 6 months)
		const revenueHistory = [];
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthName = d.toLocaleString("default", { month: "short" });
			const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
			const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

			const monthAmount = successfulTx
				.filter(
					(t) =>
						t.createdAt && t.createdAt >= monthStart && t.createdAt <= monthEnd,
				)
				.reduce((acc, t) => acc + t.amount, 0);

			revenueHistory.push({
				date: monthName,
				amount: monthAmount,
			});
		}

		return {
			totalLifetimeRevenue: Number(totalLifetimeRevenue.toFixed(2)),
			currentMonthRevenue: Number(currentMonthRevenue.toFixed(2)),
			previousMonthRevenue: Number(previousMonthRevenue.toFixed(2)),
			revenueGrowthPercentage: Number(revenueGrowthPercentage.toFixed(1)),
			revenueHistory,
		};
	}
}
