import { model } from "mongoose";
import type { ICompany } from "../interface/company.interface";
import { companySchema } from "../schema/company.schema";

export const CompanyModel = model<ICompany>("Company", companySchema);
