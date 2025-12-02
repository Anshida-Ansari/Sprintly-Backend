import { InferSchemaType } from "mongoose";
import { companySchema } from "../schema/company.schema";

export type ICompany = InferSchemaType<typeof companySchema>