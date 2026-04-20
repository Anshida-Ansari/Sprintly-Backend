import type { TransactionEntity } from "../db/repository/interface/transaction.interface";

export const TransactionMapper = {
	toMongo(entity: TransactionEntity) {
		return {
			stripePaymentId: entity.stripePaymentId,
			stripeCustomerId: entity.stripeCustomerId,
			companyId: entity.companyId,
			amount: entity.amount,
			currency: entity.currency,
			status: entity.status,
			billingReason: entity.billingReason,
		};
	},

	// biome-ignore lint/suspicious/noExplicitAny: Raw database data requires 'any' for Mongoose Document compatibility
	fromMongo(doc: any): TransactionEntity {
		return {
			id: (doc._id as { toString(): string })?.toString(),
			stripePaymentId: doc.stripePaymentId as string,
			stripeCustomerId: doc.stripeCustomerId as string,
			companyId: (doc.companyId as { toString(): string })?.toString(),
			amount: doc.amount as number,
			currency: doc.currency as string,
			status: doc.status as string,
			billingReason: doc.billingReason as string,
			createdAt: doc.createdAt as Date,
		};
	},
};
