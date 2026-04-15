import type { TransactionEntity } from "../db/repository/interface/transaction.interface";

export class TransactionMapper {
	static toMongo(entity: TransactionEntity) {
		return {
			stripePaymentId: entity.stripePaymentId,
			stripeCustomerId: entity.stripeCustomerId,
			companyId: entity.companyId,
			amount: entity.amount,
			currency: entity.currency,
			status: entity.status,
			billingReason: entity.billingReason,
		};
	}

	static fromMongo(doc: any): TransactionEntity {
		return {
			id: doc._id?.toString(),
			stripePaymentId: doc.stripePaymentId,
			stripeCustomerId: doc.stripeCustomerId,
			companyId: doc.companyId?.toString(),
			amount: doc.amount,
			currency: doc.currency,
			status: doc.status,
			billingReason: doc.billingReason,
			createdAt: doc.createdAt,
		};
	}
}
