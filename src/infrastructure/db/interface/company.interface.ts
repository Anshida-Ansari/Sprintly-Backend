import type { InferSchemaType } from "mongoose";
import type { companySchema } from "../schema/company.schema";

export type ICompany = InferSchemaType<typeof companySchema>;
