import mongoose from "mongoose";
import { transactionSchema } from "../schema/transaction.schema";

export const TransactionModel = mongoose.model("Transactions", transactionSchema);
