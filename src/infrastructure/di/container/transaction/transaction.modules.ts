import { ContainerModule } from "inversify";
import { TransactionModel } from "../../../db/models/transaction.model";
import { TransactionRepository } from "../../../db/repository/implements/transaction.repository";
import type { ITransactionRepository } from "../../../db/repository/interface/transaction.interface";
import { TRANSACTION_TYPES } from "../../types/transaction/transaction.types";

export const TransactionModule = new ContainerModule(({ bind }) => {
	bind<ITransactionRepository>(TRANSACTION_TYPES.ITransactionRepository).to(
		TransactionRepository,
	);
	bind(TRANSACTION_TYPES.TransactionModel).toConstantValue(TransactionModel);
});
