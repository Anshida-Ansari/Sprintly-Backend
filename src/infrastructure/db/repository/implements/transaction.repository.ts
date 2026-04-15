import { inject, injectable } from "inversify";
import type { Model } from "mongoose";
import { TransactionMapper } from "../../../mappers/transaction.mapper";
import { TRANSACTION_TYPES } from "../../../../infrastructure/di/types/transaction/transaction.types";
import { BaseRepository } from "./base.repository";
import type { ITransactionRepository, TransactionEntity } from "../interface/transaction.interface";

@injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity> implements ITransactionRepository {
	constructor(
		@inject(TRANSACTION_TYPES.TransactionModel)
		model: Model<any>,
	) {
		super(model);
	}

	private get transactionModel(): Model<any> {
		return this.model as any;
	}

	async findByStripePaymentId(paymentId: string): Promise<TransactionEntity | null> {
		const doc = await this.transactionModel.findOne({ stripePaymentId: paymentId });
		if (!doc) return null;
		return TransactionMapper.fromMongo(doc);
	}

	async findByCompanyId(companyId: string): Promise<TransactionEntity[]> {
		const docs = await this.transactionModel.find({ companyId });
		return docs.map((doc) => TransactionMapper.fromMongo(doc));
	}

	async getRevenueStats(): Promise<{ totalRevenue: number; monthlyRevenue: number }> {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const result = await this.transactionModel.aggregate([
			{
				$facet: {
					total: [{ $group: { _id: null, sum: { $sum: "$amount" } } }],
					monthly: [
						{ $match: { createdAt: { $gte: startOfMonth } } },
						{ $group: { _id: null, sum: { $sum: "$amount" } } },
					],
				},
			},
		]);

		return {
			totalRevenue: result[0]?.total[0]?.sum || 0,
			monthlyRevenue: result[0]?.monthly[0]?.sum || 0,
		};
	}
}
